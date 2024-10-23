import importlib

class Container():
    def __init__(self) -> None:
        self.services = {}

    def load_class(self, module_path:str, class_name:str):
        module = importlib.import_module(module_path)
        return getattr(module, class_name)()
    
    def register(self, name, path):
        self.services[name] = self.load_class(path,name)


    def resolve(self, key):
        return self.services.get(key)