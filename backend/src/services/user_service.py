from src.adapters.user_adapter import UserAdapter
from src.loaders import loader
from src import config
from src.domain.user import User
from src.dto.user_dto import UserDto
from src.logger import Logger
from src.domain.category import Category

import hashlib
import os
import hmac
import base64

class UserService:
    def __init__(self):
        self.user_adapter:UserAdapter = loader.loader.resolve(config.user_adapter["name"])

    async def create_user(self, user_dto: UserDto):
        # Hash the password with salt and pepper
        salt = await self.generate_salt()
        hashed_password = await self.hash_password(user_dto["password"], salt, os.getenv("PEPPER"))

        # Convert salt and hashed_password to a string format (Base64 or hex)
        salt_str = base64.b64encode(salt).decode("utf-8")
        hashed_password_str = base64.b64encode(hashed_password).decode("utf-8")

        # Create the User object
        user: User = User(
            user_dto["name"],
            user_dto["email"],
            hashed_password_str,
            user_dto["phone"],
            user_dto["role"],
            user_dto["picture"]
        )
        user.salt = salt_str

        return user
        
    # Generate random salts
    async def generate_salt(self):
        return os.urandom(16)

    # Hash the password
    async def hash_password(self, password, salt, pepper):
        salted_password = salt + password.encode('utf-8')
        hash_ = hmac.new(pepper.encode('utf-8'), salted_password, hashlib.sha256).digest()
        return hash_

    # Function to verify the password during login
    async def verify_password(self, user:User, password:str):
        Logger.print_info(user["salt"])
        Logger.print_info(password)
        salt = base64.b64decode(user["salt"])
        rehashed_password = await self.hash_password(password, salt, os.getenv("PEPPER"))
        password = base64.b64decode(user["password"])
        return hmac.compare_digest(password, rehashed_password)
    
    async def save_user(self, user:User):
        await self.user_adapter.save(user)

    async def get_all_users(self):
        return await self.user_adapter.find_all()
    
    async def find_by_email(self, user_email:str):
        return await self.user_adapter.find_by_email(user_email)
    
    async def delete_users(self):
        return await self.user_adapter.delete_all()
    
    async def find_by_id(self, user_id:str):
        user = await self.user_adapter.find_by_id(user_id)
        user.pop("_id")
        return user
    
    async def get_all_categories(self):
        return [category.value for category in Category]
    
    async def update_user(self, email:str, preferences:list[str]):
        user_dict = await self.user_adapter.find_by_email(email)
        user = User(
            id=user_dict["id"],
            name=user_dict["name"],
            email=user_dict["email"],
            password=user_dict["password"],
            phone=user_dict["phone"],
            role=user_dict["role"],
            picture=user_dict["picture"],
        )
        user.set_salt(user_dict["salt"])
        user.set_preferences(preferences)
        await self.user_adapter.save(user)