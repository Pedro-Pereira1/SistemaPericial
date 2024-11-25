from src.loaders import loader
from src import config
from src.adapters.alert_adapter import AlertAdapter
from src.services.user_service import UserService
from src.domain.alert import Alert
from src.dto.alert_dto import AlertDto
import random
from src.constants import countries
from src import utils



class AlertService :
    def __init__(self) -> None:
        self.alert_adapter:AlertAdapter = loader.loader.resolve(config.alert_adapter["name"])
        self.user_service:UserService = loader.loader.resolve(config.user_service["name"])

    async def create_alert(self, alert_dto:AlertDto):
        user = await self.user_service.find_by_email(alert_dto["assignedTo"])
        last_case = await self.num_rows()+1
        if not user:
            raise ModuleNotFoundError(f"You cannot assign this alert to the user: {alert_dto["assignedTo"]}")
        alert = Alert(alert_dto["category"], alert_dto["subCategory"], alert_dto["origin"], 
                      alert_dto["assignedTo"], alert_dto["status"], last_case)
        return alert
    
    async def create_alert_with_date(self, alert_dto:AlertDto):
        user = await self.user_service.find_by_email(alert_dto["assignedTo"])
        last_case = await self.num_rows()+1
        random_date = await utils.random_full_date_last_month()
        if not user:
            raise ModuleNotFoundError(f"You cannot assign this alert to the user: {alert_dto["assignedTo"]}")
        alert = Alert(alert_dto["category"], alert_dto["subCategory"], alert_dto["origin"], 
                      alert_dto["assignedTo"], alert_dto["status"], last_case, random_date)
        return alert

    async def get_all_alerts(self):
        alerts = await self.alert_adapter.find_all()
        return alerts
    
    async def save_alert(self, alert:Alert):
        return await self.alert_adapter.save(alert)
    
    async def delete_all(self):
        await self.alert_adapter.delete_all()
    
    async def find_alert_by_user_id(self, id:str):
        return await self.alert_adapter.find_by_assignTo(id)
    
    async def update_alert(self, alertId:str, newAlert:AlertDto):
        return await self.alert_adapter.update_alert(alertId,newAlert)
    
    async def assign_alert(self, userId:str, alert:AlertDto):
        return await self.alert_adapter.save(alert)
    
    async def find_by_id(self, alertId:str):
        return await self.alert_adapter.find_by_id(alertId)
    
    async def num_rows(self):
        return await self.alert_adapter.num_rows()
    
    async def generate_random_alerts(self, alert_nums):
        users = await self.user_service.get_all_users()
        alerts: list[Alert] = []
        for i in range(0, alert_nums):
            category = await self.alert_adapter.ask_for_category()
            origin = random.choice(countries)
            user = random.choice(users)
            subCategory = "DDoS-X"
            alert = await self.create_alert_with_date({
                "category": category,
                "subCategory": subCategory,
                "origin": origin[1],
                "assignedTo": user["email"],
                "status":"Open"
            })
            await self.save_alert(alert)
            alerts.append(alert)
        return alerts
