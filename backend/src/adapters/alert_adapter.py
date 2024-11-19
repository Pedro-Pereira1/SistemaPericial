from src.logger import Logger
from src.loaders.load_database import load_database
from src.domain.alert import Alert

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
