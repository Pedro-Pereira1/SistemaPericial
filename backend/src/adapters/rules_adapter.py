from src.logger import Logger
from src.loaders.load_database import load_database
from src.domain.rules import Rules

class RulesAdapter:
    def __init__(self)->None:
        self.db = load_database()
        self.db["history"].create_index("id",unique=True,background=True)

    async def save_rule(self, rules:Rules):
        Logger.print_info("Saving Rules")
        rules_dict = rules.to_dict()
        self.db["history"].insert_one(rules_dict)
        return rules
    
    async def find_all(self) -> list:
        cursor = self.db["history"].find({})

        documents = []
        for document in cursor:
            document["_id"] = str(document["_id"]) 
            documents.append(document)

        return documents