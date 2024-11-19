from src.loaders import loader
from src.services.alert_service import AlertService
from src import config
from src.dto.alert_dto import AlertDto

class AlertController:
    def __init__(self) -> None:
        self.service:AlertService = loader.loader.resolve(config.alert_service["name"])

    async def create_alert(self, alert_dto:AlertDto):
        alert = await self.service.create_alert(alert_dto)
        return await self.service.save_alert(alert)
    
    async def get_all_alerts(self):
        alerts = await self.service.get_all_alerts()
        return alerts
    
    async def delete_all(self):
        await self.service.delete_all()
        return {"message":"All alerts were deleted."}