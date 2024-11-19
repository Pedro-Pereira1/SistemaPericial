from fastapi import APIRouter
from src.loaders.loader import loader
from src import config
from src.dto.rules_dto import RulesDto
from src.controllers.rules_controller import RulesController
from src.controllers.general_controller import GeneralController
from src.controllers.user_controller import UserController
from src.controllers.alert_controller import AlertController
from src.dto.user_dto import UserDto
from src.dto.user_login_dto import UserLoginDto
from src.dto.alert_dto import AlertDto

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
    @router.delete("/history")
    async def delete_all_history():
        rules_controller:RulesController = loader.resolve(config.rules_controller["name"])
        return await rules_controller.delete_all()
    @router.get("/ip/{ip}")
    async def is_malicious(ip:str):
        general_controller:GeneralController = loader.resolve(config.general_controller["name"])
        return await general_controller.is_malicious(ip)
    @router.post("/user")
    async def sign_in(userDto:UserDto):
        user_controller:UserController = loader.resolve(config.user_controller["name"])
        return await user_controller.create_user(userDto)
    
    @router.get("/user")
    async def get_all_users():
        user_controller:UserController = loader.resolve(config.user_controller["name"])
        return await user_controller.get_all_users()
    
    @router.post("/login")
    async def login(user_login_dto:UserLoginDto):
        user_controller:UserController = loader.resolve(config.user_controller["name"])
        return await user_controller.login(user_login_dto)
    
    @router.delete("/user")
    async def delete_all_users():
        user_controller:UserController = loader.resolve(config.user_controller["name"])
        return await user_controller.delete_all()
    
    @router.post("/alert")
    async def create_alert(alert_dto:AlertDto):
        alert_controller:AlertController = loader.resolve(config.alert_controller["name"])
        return await alert_controller.create_alert(alert_dto)
    
    @router.get("/alert")
    async def get_all_alerts():
        alert_controller:AlertController = loader.resolve(config.alert_controller["name"])
        return await alert_controller.get_all_alerts()
    
    @router.delete("/alert")
    async def get_all_alerts():
        alert_controller:AlertController = loader.resolve(config.alert_controller["name"])
        return await alert_controller.delete_all()


        