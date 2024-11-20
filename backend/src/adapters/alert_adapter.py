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
            Logger.print_info(document)
            documents.append(document)

        return documents
    
    async def update_alert(self, alertId: str, newAlert: dict):
        Logger.print_info(f"Updating Alert with id {alertId}")
        self.db["alerts"].update_one({"id": alertId}, {"$set": newAlert})
        Logger.print_info(f"Alert with id {alertId} was updated.")
        Logger.print_info(newAlert)
        return newAlert
        
