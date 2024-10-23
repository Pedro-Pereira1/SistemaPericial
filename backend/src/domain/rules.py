import uuid
from datetime import datetime
class Rules:
    def __init__(self, alertType: str, rules:list):
        self.id = uuid.uuid4()
        self.alertType = alertType
        self.timestamp = datetime.now()
        self.rules = rules
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "alertType": self.alertType,  
            "timestamp": self.timestamp,
            "rules":self.rules
        }
