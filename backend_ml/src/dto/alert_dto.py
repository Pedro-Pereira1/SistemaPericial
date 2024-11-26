from typing_extensions import TypedDict

class AlertDto(TypedDict):
    type:str
    origin:str
    assignedTo:str
    status:str


def to_dict(self):
    return {
        "type": alert["type"],
        "origin": alert["origin"],
        "assignedTo": alert["assignedTo"],
        "status": alert["status"]
    }