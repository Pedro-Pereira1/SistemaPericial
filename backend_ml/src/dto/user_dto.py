from typing_extensions import TypedDict

class UserDto(TypedDict):
    name:str
    email:str
    password:str
    phone:str
    role:str
    picture:str
