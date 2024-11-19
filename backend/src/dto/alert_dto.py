from typing_extensions import TypedDict

class AlertDto(TypedDict):
    type:str
    origin:str
    assignedTo:str
    status:str