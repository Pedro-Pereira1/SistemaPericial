import joblib

class MachineLearningAdapter:
    def __init__(self)->None:
        self.base_model = joblib.load('src/ml/xgb_model.joblib')
    
    async def predict(self, model:str, random_line):
        if not model:
           return self.base_model.predict(random_line)
        else:
            raise NotImplementedError("This is not implemented yet")
