from pymongo import MongoClient
from src import config

def load_database():
    return config.client[config.client_db_name]