from typing_extensions import TypedDict

class SetPreferencesDto(TypedDict):
    email:str
    preferences:list[str]
