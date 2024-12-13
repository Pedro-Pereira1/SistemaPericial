class User:
    def __init__(self, id:str, experience_score:int, preferences:list[str]):
        self.id = id
        self.experience_score = experience_score
        self.preferences = preferences