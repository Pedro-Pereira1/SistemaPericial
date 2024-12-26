import joblib
import xgboost as xgb

class MachineLearningAdapter:
    def __init__(self)->None:
        self.base_model = joblib.load('src/ml/xgboost.joblib')
    
    async def predict(self, model:str, random_line):
        print("Predict, model:", model)
        dtest = xgb.DMatrix(random_line)
        if not model:
            return self.base_model.get_booster().predict(dtest)        
        else:
            model = joblib.load(f"src//ml//{model}.joblib")
            return model.predict(random_line)