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
    0: "Benign",
    1: "Botnet",
    2: "Bruteforce",
    3: "DDoS",
    4: "DoS",
    5: "Infiltration",
    6: "Portscan",
    7: "Webattack"
}