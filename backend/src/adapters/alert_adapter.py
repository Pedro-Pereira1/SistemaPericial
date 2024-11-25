from src.logger import Logger
from src.loaders.load_database import load_database
from src.domain.alert import Alert
from src.dto.alert_dto import AlertDto

class AlertAdapter:
    def __init__(self)->None:
        self.db = load_database()
        self.db["alerts"].create_index("id",unique=True,background=True)

    async def save(self, alert:Alert):
        Logger.print_info("Saving Alert")
        alert_dict = alert.to_dict()
        self.db["alerts"].insert_one(alert_dict)
        return alert
    
    async def find_all(self) -> list:
        cursor = self.db["alerts"].find({})

        documents = []
        for document in cursor:
            document["_id"] = str(document["_id"]) 
            documents.append(document)

        return documents

    async def delete_all(self):
        self.db["alerts"].delete_many({})

    async def find_by_assignTo(self, id:str):
        cursor = self.db["alerts"].find({"assignedTo":id})

        documents = []
        for document in cursor:
            document["_id"] = str(document["_id"]) 
            documents.append(document)

        return documents
    
    async def update_alert(self, alertId: str, newAlert: dict):
        self.db["alerts"].update_one({"id": alertId}, {"$set": newAlert})
        Logger.print_info(f"Alert with id {alertId} was updated.")
        return newAlert
    
    async def find_by_id(self, alertId:str):
        document = self.db["alerts"].find_one({"id":alertId})
        Logger.print_info(f"Found the alert: {alertId}.")
        document.pop("_id")
        return document
    
    async def num_rows(self):
        return self.db["alerts"].count_documents({})
    
    async def ask_for_category(self):
        return "DDoS"