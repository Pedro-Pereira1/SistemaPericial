import os
from langfuse.callback import CallbackHandler
from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()

rules_controller = {
    "name":"RulesController",
    "path":"src.controllers.rules_controller"
}

rules_service = {
    "name":"RulesService",
    "path":"src.services.rules_service"
}

rules_adapter = {
    "name":"RulesAdapter",
    "path":"src.adapters.rules_adapter"
}

db_connection_string=os.getenv("DB_CONNECTION_STRING")
client = MongoClient(db_connection_string)
client_db_name = "ShieldAI"