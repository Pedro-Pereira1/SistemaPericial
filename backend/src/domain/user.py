import uuid
from src.domain.category import Category
from uuid import UUID

class User:
    '''
    Constructor
    @param name - the name of the user
    @param email - the email of the user
    @param password - the password of the user
    @param phone - the phone of the user
    @param role - the role of the user
    @param picture - the picture as a string
    '''
    def __init__(self, name: str, email:str, password:str,
        phone:str, role:str, picture:str, experience_score:str = 0, 
        categories_preferencess:list[Category] = [], id:str = None):
        self.id = str(uuid.uuid4()) if not id else id
        self.name = name
        self.email = email
        self.password = password
        self.phone = phone
        self.role = role
        self.picture = picture
        self.salt = ""
        self.experience = experience_score
        self.categories_preferences = categories_preferencess
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,  
            "email": self.email,
            "password":self.password,
            "phone":self.phone,
            "role":self.role,
            "picture":self.picture,
            "salt":self.salt,
            "experience_score": self.experience,
            "categories_preferences": [category.value for category in self.categories_preferences]
        }
    
    def set_salt(self, salt:str):
        self.salt = salt

    def get_salt(self):
        return self.salt
    
    def set_preferences(self, preferences:list[str]):
        self.categories_preferences = [
            Category[preference.upper()] for preference in preferences if preference.upper() in Category.__members__
        ]