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
    2: {"category": "Bruteforce", "subCategory": "FTP"},
    3: {"category": "Bruteforce", "subCategory": "SSH"},
    4: {"category": "DDoS", "subCategory": "Undetermined"},
    5: {"category": "DDoS", "subCategory": "DNS"},
    6: {"category": "DDoS", "subCategory": "Ddossim"},
    7: {"category": "DDoS", "subCategory": "HOIC"},
    8: {"category": "DDoS", "subCategory": "LDAP"},
    9: {"category": "DDoS", "subCategory": "LOIC-HTTP"},
    10: {"category": "DDoS", "subCategory": "MSSQL"},
    11: {"category": "DDoS", "subCategory": "NTP"},
    12: {"category": "DDoS", "subCategory": "NetBIOS"},
    13: {"category": "DDoS", "subCategory": "SNMP"},
    14: {"category": "DDoS", "subCategory": "Slowloris"},
    15: {"category": "DDoS", "subCategory": "Syn"},
    16: {"category": "DDoS", "subCategory": "TFTP"},
    17: {"category": "DDoS", "subCategory": "UDP"},
    18: {"category": "DDoS", "subCategory": "UDPLag"},
    19: {"category": "DoS", "subCategory": "Goldeneye"},
    20: {"category": "DoS", "subCategory": "Heartbleed"},
    21: {"category": "DoS", "subCategory": "Hulk"},
    22: {"category": "DoS", "subCategory": "Rudy"},
    23: {"category": "DoS", "subCategory": "Slowbody"},
    24: {"category": "DoS", "subCategory": "Slowheaders"},
    25: {"category": "DoS", "subCategory": "Slowhttptest"},
    26: {"category": "DoS", "subCategory": "Slowloris"},
    27: {"category": "DoS", "subCategory": "Slowread"},
    28: {"category": "Infiltration", "subCategory": "Undetermined"},
    29: {"category": "Portscan", "subCategory": "Undetermined"},
    30: {"category": "Webattack", "subCategory": "SQLi"},
    31: {"category": "Webattack", "subCategory": "XSS"},
    32: {"category": "Webattack", "subCategory": "Bruteforce"}
}

backend_url="http://localhost:7000"
