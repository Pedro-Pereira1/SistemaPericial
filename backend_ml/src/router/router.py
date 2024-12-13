from fastapi import APIRouter
from src.loaders.loader import loader
from src import config
from src.controllers.ml_controller import MachineLearningController

router = APIRouter()

class Router:
    @router.get("/predict/{model}")
    async def predict(model:str = None):
        ml_controller:MachineLearningController = loader.resolve(config.ml_controller["name"]) 
        return await ml_controller.predict(model) 

    @router.get("/predict")
    async def predict_default():
        ml_controller:MachineLearningController = loader.resolve(config.ml_controller["name"]) 
        return await ml_controller.predict(None) 
    
    @router.get("/genetic")
    async def genetic():
        ml_controller:MachineLearningController = loader.resolve(config.ml_controller["name"]) 
        return await ml_controller.genetic() 
        