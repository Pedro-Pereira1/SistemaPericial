from src.loaders.container import Container
from src.loaders import index
from src.logger import Logger

loader = Container()

Logger.print_info('Loading the Repositories/Adapters')
for adapter in index.adapters:
    loader.register(
        adapter["name"],
        adapter["path"]
    )   
Logger.print_info('Loading the Services')
for service in index.services:
    loader.register(
        service["name"],
        service["path"]
    )

Logger.print_info("Loading the Controllers")
for controller in index.controllers:
    loader.register(
        controller["name"],
        controller["path"]
    )