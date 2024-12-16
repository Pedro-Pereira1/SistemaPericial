class Alert:
    def __init__(self, id:str, priority:int, client:int, creation_time:str, category:str):
        self.id = id
        self.priority = priority
        self.client = client
        self.creation_time = creation_time
        self.category = category

    def __str__(self):
        return f"{self.client}"
        