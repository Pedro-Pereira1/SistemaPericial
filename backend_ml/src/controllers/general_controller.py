from src.loaders import loader
from src.services.general_service import GeneralService
from src import config
from fastapi.responses import JSONResponse


class GeneralController:
    def __init__(self) -> None:
        self.service:GeneralService = loader.loader.resolve(config.general_service["name"])
    
    async def is_malicious(self, ip):
        try :
            is_malicious = await self.service.is_malicious(ip)
            return {
                "is_malicious":is_malicious
            }
        except Exception as e: 
            return JSONResponse(
            status_code=400,
            content={
                "message": "Bad Request",
                "exception": str(e)
            }
        )