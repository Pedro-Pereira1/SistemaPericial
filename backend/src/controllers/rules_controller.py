from fastapi import UploadFile
from src.loaders import loader
from src.services.rules_service import RulesService
from src import config


class RulesController:
    def __init__(self) -> None:
        self.service:RulesService = loader.loader.resolve(config.rules_service["name"])

    async def get_all_rules(self):
        return await self.service.get_all_rules()