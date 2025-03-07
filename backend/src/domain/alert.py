import uuid
from datetime import datetime

class Alert:
    def __init__(self, category:str, subCategory:str, origin:str, assignedTo:str, status:str, 
                 last_case:int, priority:float, start_date: str = None, id:str = None):
        self.id = str(uuid.uuid4()) if not id else id
        self.title = f'[Case#{last_case}] {category}: {subCategory}'
        self.category = category
        self.subCategory = subCategory
        self.origin = origin
        self.assignedTo = assignedTo
        self.status = status
        self.creationTime = start_date if start_date else datetime.now().strftime("%Y-%m-%dT%H:%M:%S")        
        self.conclusionTime = ""
        self.description = "Automatically Generated hehe"
        self.resolution = []
        self.priority = priority
        self.number = last_case
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "category": self.category,
            "subCategory": self.subCategory,
            "origin": self.origin,
            "assignedTo": self.assignedTo,
            "status": self.status,
            "creationTime": self.creationTime,
            "conclusionTime": self.conclusionTime,
            "description": self.description,
            "resolution": self.resolution,
            "priority": self.priority,
            "number":self.number
        }

    
    def change_status(self, status:str):
        self.status = status
    def assign(self, email:str):
        self.assignedTo = email
