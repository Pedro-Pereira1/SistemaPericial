from src.loaders import loader
from src.services.alert_service import AlertService
from src.services.user_service import UserService
from src import config
from src.dto.alert_dto import AlertDto

class AlertController:
    def __init__(self) -> None:
        self.service:AlertService = loader.loader.resolve(config.alert_service["name"])
        self.user_service:UserService = loader.loader.resolve(config.user_service["name"])

    async def create_alert(self, alert_dto:AlertDto):
        try:
            alert = await self.service.create_alert(alert_dto)
            return await self.service.save_alert(alert)
        except Exception as e:
            return {"message": str(e)}
    
    async def get_all_alerts(self):
        alerts = await self.service.get_all_alerts()
        return alerts
    
    async def delete_all(self):
        await self.service.delete_all()
        return {"message":"All alerts were deleted."}
    
    async def find_alerts_by_user_id(self, id:str):
        user = await self.user_service.find_by_email(id)
        if not user:
           return {"message":"This user does not exist."}
        return await self.service.find_alert_by_user_id(id)
    
    async def update_alert(self, alertId:str,newAlert:AlertDto):
        return await self.service.update_alert(alertId,newAlert)
    
    async def assign_alert(self, userId:str, alert:AlertDto):
        user = await self.user_service.find_by_email(userId)
        if not user:
            return {"message":"This user does not exist."}
        alert = await self.service.create_alert(alert)
        return await self.service.save_alert(alert)
    
    async def get_alert_by_id(self, alertId:str):
        return await self.service.find_by_id(alertId)
    
    async def generate_random_alerts(self, alert_nums:int, model:str):
        alerts = await self.service.generate_random_alerts(alert_nums,model)
        genetic_results = await self.service.genetic_results()
        return await self.service.assign_alerts_by_user(genetic_results)

        