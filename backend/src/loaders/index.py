from src import config

controllers = [
    config.rules_controller,
    config.general_controller,
    config.user_controller,
    config.alert_controller
]

services = [
    config.rules_service,
    config.general_service,
    config.user_service,
    config.alert_service
]

adapters = [
    config.rules_adapter,
    config.general_adapter,
    config.user_adapter,
    config.alert_adapter
]