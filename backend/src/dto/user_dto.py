from typing_extensions import TypedDict, NotRequired

class UserDto(TypedDict):
    id:NotRequired[str]
    name:str
    email:str
    password:str
    phone:str
    role:str
    picture:str
    experience_score:NotRequired[float]
    categories_preferences:NotRequired[list[str]]
