import joblib
import xgboost as xgb

class MachineLearningAdapter:
    def __init__(self)->None:
        self.base_model = joblib.load('src/ml/xgboost.joblib')
    
    async def define_model(self, model:str):
        try:
            self.base_model = joblib.load(f'src/ml/{model}.joblib')
        except Exception as e:
            self.base_model = joblib.load('src/ml/xgboost.joblib')

    async def predict(self, random_line):
        return self.base_model.predict(random_line)       