from src.loaders import loader
from src import config
from src.services.ml_service import MachineLearningService

class MachineLearningController:
    def __init__(self):
        self.ml_service:MachineLearningService = loader.loader.resolve(config.ml_service["name"])

    async def predict(self, model:str):
        return await self.ml_service.predict(model)