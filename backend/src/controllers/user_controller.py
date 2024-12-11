from src.loaders import loader
from src import config
from src.services.user_service import UserService
from src.dto.user_dto import UserDto
from src.dto.user_login_dto import UserLoginDto

class UserController:
    def __init__(self):
        self.user_service:UserService = loader.loader.resolve(config.user_service["name"])

    async def create_user(self, user_dto:UserDto):
        user = await self.user_service.create_user(user_dto)
        await self.user_service.save_user(user)
        return user.to_dict()
    
    async def get_all_users(self):
        return await self.user_service.get_all_users()


    async def login(self, user_login_dto:UserLoginDto):
        try:
            user = await self.user_service.find_by_email(user_login_dto["email"])
            exists = await self.user_service.verify_password(user, user_login_dto["password"])
            user.pop("_id")
            user["password"]=""
            user.pop("salt")
            if(exists):
                return user
            return {"message":"The login is invalid"}
        except:
            return {"message":"Invalid email or password."}

    async def delete_all(self):
        return await self.user_service.delete_users()
    
    async def find_by_id(self, user_id:str):
        return await self.user_service.find_by_id(user_id)

    async def get_all_categories(self):
        return await self.user_service.get_all_categories()
    
    async def update_user_preferences(self, email:str, preferences:list[str]):
        return await self.user_service.update_user_preferences(email, preferences)
    
    async def update_user(self, user:UserDto):
        return await self.user_service.update_user(user)
