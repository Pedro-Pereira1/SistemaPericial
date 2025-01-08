from src.loaders import loader
from src import config
from src.adapters.alert_adapter import AlertAdapter
from src.services.user_service import UserService
from src.domain.alert import Alert
from src.dto.alert_dto import AlertDto
import random
from src.constants import clients
from src import utils
import httpx
from src.domain.user import User
import asyncio



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
                        '', alert_dto["status"], last_case, alert_dto["priority"])
        return alert
    
    async def create_alert_with_date(self, alert_dto:AlertDto):
        user = await self.user_service.find_by_email(alert_dto["assignedTo"])
        last_case = await self.num_rows()+1
        random_date = await utils.random_full_date_last_month()
        if not user:
            raise ModuleNotFoundError(f"You cannot assign this alert to the user: {alert_dto["assignedTo"]}")
        alert = Alert(alert_dto["category"], alert_dto["subCategory"], alert_dto["origin"], '', alert_dto["status"], last_case, random.randint(1,5), random_date)
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
    
    async def generate_random_alerts(self, alert_nums, model):
        users = await self.user_service.get_all_users()
        alerts: list[Alert] = []
        predictions = await self.alert_adapter.ask_for_categories(model, alert_nums)
        for i in range(alert_nums):
            origin = random.choice(clients)
            user = random.choice(users)
            alert = await self.create_alert_with_date({
                "category": predictions[i],
                "subCategory": "Undetermined",
                "origin": origin[1],
                "assignedTo": user["email"],
                "status": "Open"
            })
            await self.save_alert(alert)
            alerts.append(alert)
        return alerts

    
    async def genetic_results(self, algorithm):
        print("Algorithm: ", algorithm)
        timeout = httpx.Timeout(120.0)  # Set the timeout to 10 seconds (adjust as needed)
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.get(f"http://localhost:6500/{algorithm}")
        if response.status_code == 200:
            return response.json()
        raise Exception(f"Error fetching genetic results: {response.status_code}")
        
    async def assign_alerts_by_user(self, assignments: dict):
        """
        Assign alerts to users based on the given assignments.

        :param assignments: A dictionary where keys are user IDs and values are lists of alert IDs.
        """
        counter = await self.num_rows()

        async def assign_task(user_id, alert_id):
            # Fetch user and alert details
            user_dict = await self.user_service.find_by_id(user_id)
            alert_dict = await self.alert_adapter.find_by_id(alert_id)

            # Create a new Alert object
            alert = Alert(
                category=alert_dict["category"],
                subCategory=alert_dict["subCategory"],
                origin=alert_dict["origin"],
                assignedTo=user_dict["email"],
                status=alert_dict["status"],
                last_case=counter + 1,
                priority=alert_dict["priority"],
                start_date=alert_dict["creationTime"],
                id=alert_dict["id"]
            )

            print(alert.to_dict())  # Print the alert for verification
            await self.alert_adapter.save(alert)  # Save the alert

        # Gather all tasks based on assignments
        tasks = []
        for user_id, alert_ids in assignments["assignments"].items():
            for alert_id in alert_ids:
                tasks.append(assign_task(user_id, alert_id))

        # Run all tasks concurrently
        await asyncio.gather(*tasks)
        return {"data": assignments}

