from src.loaders import loader
from src import config
from src.adapters.general_adapter import GeneralAdapter


class GeneralService :
    def __init__(self) -> None:
        self.general_adapter:GeneralAdapter = loader.loader.resolve(config.general_adapter["name"])

    async def is_malicious(self, ip:str):
        abuse_report = await self.general_adapter.is_malicious_abuseipdb(ip)
        return abuse_report["data"]["abuseConfidenceScore"] > 0