import joblib
import xgboost as xgb
import numpy as np

class MachineLearningAdapter:
    def __init__(self)->None:
        self.base_model = joblib.load('src/ml/xgboost.joblib')
        self.model_name = "xgboost"
    
    async def define_model(self, model:str):
        try:
            
            self.base_model = joblib.load(f'src/ml/{model}.joblib')
            self.model_name = model
           
        except Exception as e:
            self.base_model = joblib.load('src/ml/xgboost.joblib')
            self.model_name = "xgboost"
            

    async def predict(self, random_line): 
        if(self.model_name=="cnn_rnn"):
            random_line = np.expand_dims(random_line,axis=2)
            return np.argmax(self.base_model.predict(random_line),axis=1)
        return self.base_model.predict(random_line)       