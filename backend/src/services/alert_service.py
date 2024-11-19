from src.loaders import loader
from src import config
from src.adapters.alert_adapter import AlertAdapter
from src.domain.alert import Alert
from src.dto.alert_dto import AlertDto


class AlertService :
    def __init__(self) -> None:
        self.alert_adapter:AlertAdapter = loader.loader.resolve(config.alert_adapter["name"])

    async def create_alert(self, alert_dto:AlertDto):
        alert = Alert(alert_dto["type"], alert_dto["origin"], 
                      alert_dto["assignedTo"], alert_dto["status"])
        return alert

    async def get_all_alerts(self):
        alerts = await self.alert_adapter.find_all()
        return alerts
    
    async def save_alert(self, alert:Alert):
        return await self.alert_adapter.save(alert)
    
    async def delete_all(self):
        await self.alert_adapter.delete_all()