import os
from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()


ml_controller = {
    "name":"MachineLearningController",
    "path":"src.controllers.ml_controller"
}

ml_service = {
    "name":"MachineLearningService",
    "path":"src.services.ml_service"
}

ml_adapter = {
    "name":"MachineLearningAdapter",
    "path":"src.adapters.ml_adapter"
}

db_connection_string=os.getenv("DB_CONNECTION_STRING")
abuse_ipdb_api_key=os.getenv("ABUSEIPDB_API_KEY")
client = MongoClient(db_connection_string)
client_db_name = "ShieldAI"

model_categories = {
    0: {"category": "Benign", "subCategory": "Undetermined"},
    1: {"category": "Botnet", "subCategory": "Undetermined"},
    2: {"category": "Bruteforce", "subCategory": "Undetermined"},
    3: {"category": "DoS", "subCategory": "Undetermined"},
    4: {"category": "DDoS", "subCategory": "Undetermined"},
    5: {"category": "Infiltration", "subCategory": "Undetermined"},
    6: {"category": "Portscan", "subCategory": "Undetermined"},
    7: {"category": "Webattack", "subCategory": "Undetermined"},
}

backend_url="http://localhost:7000"
