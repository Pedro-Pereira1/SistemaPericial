import os
from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()

rules_controller = {
    "name":"RulesController",
    "path":"src.controllers.rules_controller"
}
user_controller = {
    "name":"UserController",
    "path":"src.controllers.user_controller"
}

general_controller = {
    "name":"GeneralController",
    "path":"src.controllers.general_controller"
}

alert_controller = {
    "name":"AlertController",
    "path":"src.controllers.alert_controller"
}

rules_service = {
    "name":"RulesService",
    "path":"src.services.rules_service"
}

user_service = {
    "name":"UserService",
    "path":"src.services.user_service"
}

general_service = {
    "name":"GeneralService",
    "path":"src.services.general_service"
}

alert_service = {
    "name":"AlertService",
    "path":"src.services.alert_service"
}

rules_adapter = {
    "name":"RulesAdapter",
    "path":"src.adapters.rules_adapter"
}

user_adapter = {
    "name":"UserAdapter",
    "path":"src.adapters.user_adapter"
}

general_adapter = {
    "name":"GeneralAdapter",
    "path":"src.adapters.general_adapter"
}

alert_adapter = {
    "name":"AlertAdapter",
    "path":"src.adapters.alert_adapter"
}


db_connection_string=os.getenv("DB_CONNECTION_STRING")
abuse_ipdb_api_key=os.getenv("ABUSEIPDB_API_KEY")
client = MongoClient(db_connection_string)
client_db_name = "ShieldAI"