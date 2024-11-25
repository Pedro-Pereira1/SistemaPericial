import uuid
class Alert:
    def __init__(self, type:str, origin:str, assignedTo:str, status:str):
        self.id = uuid.uuid4()
        self.type = type
        self.origin = origin
        self.assignedTo = assignedTo
        self.status = status
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "type": self.type,  
            "origin": self.origin,
            "assignedTo":self.assignedTo,
            "status":self.status
        }
    
    def change_status(self, status:str):
        self.status = status
