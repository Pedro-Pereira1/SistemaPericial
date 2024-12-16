from src.logger import Logger
from src.domain.user import User
from src.loaders.load_database import load_database

class UserAdapter:
    def __init__(self)->None:
        self.db = load_database()
        self.db["users"].create_index("id",unique=True,background=True)

    async def save(self, user:User):
        Logger.print_info("Saving the user: " + user.name)
        user_dict = user.to_dict()
        print(user_dict)
        self.db["users"].find_one_and_replace(filter={"email": user_dict["email"]}, replacement=user_dict, upsert=True)
        return user
    
    async def find_all(self) -> list:
        cursor = self.db["users"].find({})

        documents = []
        for document in cursor:
            document["_id"] = str(document["_id"]) 
            documents.append(document)

        return documents

    async def delete_all(self):
        self.db["users"].delete_many({})

    async def find_by_email(self, email:str):
        Logger.print_info(email)
        return self.db["users"].find_one({"email":email})
    
    async def find_by_id(self, user_id:str):
        return self.db["users"].find_one({"id":user_id})
    
    async def find_user_to_work(self) -> list:
        cursor = self.db["users"].find({"role": {"$ne": "SOC Manager"}})

        documents = []
        for document in cursor:
            document.pop("_id") 
            documents.append(document)

        return documents
        

