from src.adapters.ml_adapter import MachineLearningAdapter
from src.loaders import loader
from src import config
from src.logger import Logger
import pandas as pd
import numpy as np
import time
import random
import requests
from src.domain.alert import Alert
from src.domain.user import User
from src.domain.genetic_algorithm import genetic_algorithm
from src.domain.pso import particle_swarm_optimization

class MachineLearningService:
    def __init__(self):
        self.ml_adapter:MachineLearningAdapter = loader.loader.resolve(config.ml_adapter["name"])
        self.dataset = self.import_dataset()

    async def predict(self, model:str):
        await self.ml_adapter.define_model(model)
        while(category == "Benign"):
            start_time = time.time()
            random_line = await self.import_random_line()
            end_time = time.time()
            print(f"Time: {end_time-start_time}")
            result = await self.ml_adapter.predict(model, random_line)
            Logger.print_info(result)
            random_line_dict = random_line.iloc[0].to_dict()   
            random_line_dict = {key: self._to_serializable(value) for key, value in random_line_dict.items()}
            random_line_dict["prediction"] = config.model_categories[result[0]]
            category = random_line_dict["prediction"]["category"]
        return random_line_dict
    
    async def predict_a_lot(self, model:str, num:int) -> list[dict]:
        await self.ml_adapter.define_model(model)
        random_lines_dict = []
        for i in range(num):
            category:str = "Benign"
            while(category == "Benign"):
                random_line = await self.import_random_line()
                result = await self.ml_adapter.predict(random_line)
                Logger.print_info(result)
                random_line_dict = random_line.iloc[0].to_dict()   
                random_line_dict = {key: self._to_serializable(value) for key, value in random_line_dict.items()}
                random_line_dict["prediction"] = config.model_categories[result[0]]
                category = random_line_dict["prediction"]["category"]
            random_lines_dict.append(category)
        return random_lines_dict

    def import_dataset(self):
        df = pd.read_parquet("src/ml/data/cic-collection-balanced.parquet")
        return df.drop(['Label', 'ClassLabel'], axis=1)

    async def import_random_line(self):
        random_index = random.randint(0, len(self.dataset) - 1)
        return self.dataset.iloc[[random_index]] 
       
    @staticmethod
    def _to_serializable(value):
        if isinstance(value, (np.integer, np.floating)):
            return value.item()
        elif isinstance(value, np.ndarray):
            return value.tolist()
        return value
    
    async def genetic_algorithm(self):
        alerts:list[Alert] = [Alert(alert["id"], alert["priority"], alert["origin"], alert["creationTime"], alert["category"]) for alert in await self.get_all_alerts()]
        users:list[User] = [User(user["id"], user["experience_score"], user["categories_preferences"]) for user in await self.get_all_users()]
        starting_time:time = time.time()
        alerts = genetic_algorithm(alerts, users, int(len(alerts)*100), 10)
        ending_time:time = time.time()
        alerts["time"] = ending_time - starting_time
        return alerts

    async def get_all_alerts(self) -> list[dict]:
        response = requests.get(f"{config.backend_url}/alerts")
        if response.status_code == 200:
            return response.json()
        return None
    
    async def get_all_users(self) -> list[dict]:
        response = requests.get(f"{config.backend_url}/user/work")
        if response.status_code == 200:
            return response.json()
        return None
    
    async def pso(self):
        alerts:list[Alert] = [Alert(alert["id"], alert["priority"], alert["origin"], alert["creationTime"], alert["category"]) for alert in await self.get_all_alerts()]
        users:list[User] = [User(user["id"], user["experience_score"], user["categories_preferences"]) for user in await self.get_all_users()]
        generations = len(alerts)*len(users)
        if(generations < 200): generations = 200
        starting_time:time = time.time()
        alerts = particle_swarm_optimization(alerts, users, 30, len(alerts)*len(users))
        ending_time:time = time.time()
        alerts["time"] = ending_time - starting_time
        return alerts
