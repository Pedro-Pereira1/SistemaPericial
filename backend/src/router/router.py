from fastapi import APIRouter
from src.loaders.loader import loader
from src import config
from src.dto.rules_dto import RulesDto
from src.controllers.rules_controller import RulesController
from src.controllers.general_controller import GeneralController


router = APIRouter()

class Router:
    @router.get("/history")
    async def default():
        rules_controller:RulesController = loader.resolve(config.rules_controller["name"]) 
        return await rules_controller.get_all_rules()
    @router.post("/history")
    async def add_to_history(rules:RulesDto):
        rules_controller:RulesController = loader.resolve(config.rules_controller["name"])
        return await rules_controller.add_to_history(rules)
    @router.get("/ip/{ip}")
    async def is_malicious(ip:str):
        general_controller:GeneralController = loader.resolve(config.general_controller["name"])
        return await general_controller.is_malicious(ip)
        