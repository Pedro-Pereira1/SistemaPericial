from fastapi import APIRouter, HTTPException
from src.loaders.loader import loader
from src import config
from src.controllers.ml_controller import MachineLearningController

router = APIRouter()

class Router:
    @router.get("/predict/{model}")
    async def predict(model: str):
        try:
            ml_controller: MachineLearningController = loader.resolve(config.ml_controller["name"])
            return await ml_controller.predict(model)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @router.get("/predict")
    async def predict_default():
        try:
            ml_controller: MachineLearningController = loader.resolve(config.ml_controller["name"])
            return await ml_controller.predict(None)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/genetic")
    async def genetic():
        try:
            ml_controller: MachineLearningController = loader.resolve(config.ml_controller["name"])
            return await ml_controller.genetic()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
