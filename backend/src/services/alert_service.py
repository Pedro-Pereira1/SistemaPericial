from src.loaders import loader
from src import config
from src.adapters.alert_adapter import AlertAdapter
from src.services.user_service import UserService
from src.domain.alert import Alert
from src.dto.alert_dto import AlertDto


class AlertService :
    def __init__(self) -> None:
        self.alert_adapter:AlertAdapter = loader.loader.resolve(config.alert_adapter["name"])
        self.user_service:UserService = loader.loader.resolve(config.user_service["name"])

    async def create_alert(self, alert_dto:AlertDto):
        user = await self.user_service.find_by_email(alert_dto["assignedTo"])
        if not user:
            raise ModuleNotFoundError(f"You cannot assign this alert to the user: {alert_dto["assignedTo"]}")
        alert = Alert(alert_dto["category"], alert_dto["subCategory"], alert_dto["origin"], 
                      alert_dto["assignedTo"], alert_dto["status"])
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