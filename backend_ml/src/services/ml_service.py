from src.adapters.ml_adapter import MachineLearningAdapter
from src.loaders import loader
from src import config
from src.logger import Logger
import pandas as pd
import numpy as np
import time
import random

class MachineLearningService:
    def __init__(self):
        self.ml_adapter:MachineLearningAdapter = loader.loader.resolve(config.ml_adapter["name"])
        self.dataset = self.import_dataset()
    async def predict(self, model:str):
        random_line = await self.import_random_line()
        result = await self.ml_adapter.predict(model, random_line)
        Logger.print_info(result)
        random_line_dict = random_line.iloc[0].to_dict()   
        random_line_dict = {key: self._to_serializable(value) for key, value in random_line_dict.items()}
        print(result)
        random_line_dict["prediction"] = config.model_categories[result[0]]
        return random_line_dict

    def import_dataset(self):
        df = pd.read_parquet("src\\ml\\data\\cic-collection.parquet")
        return df.drop(['Label','ClassLabel'], axis=1)

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