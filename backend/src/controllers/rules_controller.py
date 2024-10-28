from src.loaders import loader
from src.services.rules_service import RulesService
from src import config


class RulesController:
    def __init__(self) -> None:
        self.service:RulesService = loader.loader.resolve(config.rules_service["name"])

    async def get_all_rules(self):
        return await self.service.get_all_rules()
    
    async def add_to_history(self, rules):
        return await self.service.add_to_history(rules)  

    async def delete_all(self):
        try:
            await self.service.delete_all()
        except Exception as e: 
            return {"message":f"Error: {e.message()}"}
        return {"message":"DB Deleted"}   