from src.loaders import loader
from src import config
from src.adapters.rules_adapter import RulesAdapter
from src.domain.rules import Rules
from src.dto.rules_dto import RulesDto


class RulesService :
    def __init__(self) -> None:
        self.rules_adapter:RulesAdapter = loader.loader.resolve(config.rules_adapter["name"])

    async def get_all_rules(self):
        rules = await self.rules_adapter.find_all()
        print(rules)
        return rules
    
    async def add_to_history(self, rules:RulesDto):
        rules_obj = Rules(rules["alertType"], rules["rules"])
        return await self.rules_adapter.save_rule(rules_obj)
        