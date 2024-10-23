import uuid

class Rules:
    def __init__(self, alertType: str, timestamp: str, rules:list):
        self.id = uuid.uuid4()
        self.alertType = alertType
        self.timestamp = timestamp
        self.rules = rules
    
    def to_dict(self):
        return {
            "id": self.id,
            "alertType": self.alertType,  
            "timestamp": self.timestamp,
            "rules":self.rules
        }
