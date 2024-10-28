import requests
import json
from src import config

class GeneralAdapter:
    def __init__(self)->None:
        pass

    async def is_malicious_abuseipdb(self, ip:str) -> bool:
        # Defining the api-endpoint
        url = 'https://api.abuseipdb.com/api/v2/check'

        querystring = {
            'ipAddress': ip,
            'maxAgeInDays': '90'
        }

        headers = {
            'Accept': 'application/json',
            'Key': config.abuse_ipdb_api_key
        }

        response = requests.request(method='GET', url=url, headers=headers, params=querystring)

        # Formatted output
        decodedResponse = json.loads(response.text)
        return decodedResponse
