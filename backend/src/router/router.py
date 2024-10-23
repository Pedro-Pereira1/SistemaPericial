from fastapi import APIRouter,FastAPI, UploadFile, File, Body
from src.loaders.loader import loader
from src import config
from src.dto.rules_dto import RulesDto
from src.logger import Logger
from src.controllers.rules_controller import RulesController

router = APIRouter()

class Router:
    @router.get("/history")
    async def default():
        rules_controller:RulesController = loader.resolve(config.rules_controller["name"]) 
        return await rules_controller.get_all_rules()
    @router.post("/history/")
    async def send_prompt(rules:RulesDto):
        rules_controller:RulesController = loader.resolve(config.rules_controller["name"])
        return await {}