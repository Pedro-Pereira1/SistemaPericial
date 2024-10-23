from src.loaders import loader
from src import config
from src.adapters.rules_adapter import RulesAdapter

class RulesService :
    def __init__(self) -> None:
        self.rules_adapter:RulesAdapter = loader.loader.resolve(config.rules_adapter["name"])

    async def get_all_rules(self):
        rules = await self.rules_adapter.find_all()
        print(rules)
        return rules
    
    async def add_to_history(self, rules):
        return await self.rules_adapter.save_rule(rules)
        