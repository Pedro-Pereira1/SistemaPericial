from typing_extensions import TypedDict, NotRequired

class AlertDto(TypedDict):
    id:NotRequired[str]
    category:str
    subCategory:str
    origin:str
    assignedTo:str
    status:str
    creationTime:NotRequired[str]
    conclusionTime:NotRequired[str]
    description:NotRequired[str]
    resolution:NotRequired[str]