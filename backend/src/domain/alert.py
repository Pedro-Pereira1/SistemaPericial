import uuid
from datetime import datetime

class Alert:
    def __init__(self, category:str, subCategory:str, origin:str, assignedTo:str, status:str):
        self.id = uuid.uuid4()
        self.category = category
        self.subCategory = subCategory
        self.origin = origin
        self.assignedTo = assignedTo
        self.status = status
        self.creationTime = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        self.conclusionTime = ""
        self.description = "Automatically Generated hehe"
        self.resolution = []
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "category": self.category,
            "subCategory": self.subCategory,
            "origin": self.origin,
            "assignedTo": self.assignedTo,
            "status": self.status,
            "creationTime": self.creationTime,
            "conclusionTime": self.conclusionTime,
            "description": self.description,
            "resolution": self.resolution
        }

    
    def change_status(self, status:str):
        self.status = status
