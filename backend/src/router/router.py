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
from src.dto.set_preferences_dto import SetPreferencesDto

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
    @router.post("/user/sign_in")
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
    
    @router.get("/alert/user/{id}")
    async def get_alert_for_user_by_id(id:str):
        alert_controller:AlertController = loader.resolve(config.alert_controller["name"])
        return await alert_controller.find_alerts_by_user_id(id)
    
    @router.get("/user/id/{id}")
    async def get_user_by_id(id:str):
        user_controller:UserController = loader.resolve(config.user_controller["name"])
        return await user_controller.find_by_id(id)
    
    @router.put("/updateAlert/{id}")
    async def update_alert(id:str, newAlert:AlertDto):
        alert_controller:AlertController = loader.resolve(config.alert_controller["name"])
        print(f"Updating alert with id: {id}")
        return await alert_controller.update_alert(id,newAlert)

    @router.post("/alert/assign/{userId}")
    async def assign_alert(userId:str, alert:AlertDto):
        alert_controller:AlertController = loader.resolve(config.alert_controller["name"])
        return await alert_controller.assign_alert(userId, alert)
    
    @router.get("/alert/{alertId}")
    async def get_alert_by_id(alertId:str):
        alert_controller:AlertController = loader.resolve(config.alert_controller["name"])
        return await alert_controller.get_alert_by_id(alertId)


    #axios.post('http://localhost:7000/alerts/random/' + numAlerts,selectedModel);
    @router.post("/alerts/random/{alert_nums}/{model}")
    async def generate_random_alerts(alert_nums:int, model:str):
        alert_controller:AlertController = loader.resolve(config.alert_controller["name"])
        return await alert_controller.generate_random_alerts(alert_nums, model)
    
    @router.get("/category")
    async def get_all_categories():
        user_controller:UserController = loader.resolve(config.user_controller["name"])
        return await user_controller.get_all_categories()
    
    @router.put("/user/preferences")
    async def update_user_preferences(dto:SetPreferencesDto):
        user_controller:UserController = loader.resolve(config.user_controller["name"])
        return await user_controller.update_user_preferences(dto["email"], dto["preferences"])
    
    @router.put("/user")
    async def update_user(dto:UserDto):
        user_controller:UserController = loader.resolve(config.user_controller["name"])
        return await user_controller.update_user(dto)
