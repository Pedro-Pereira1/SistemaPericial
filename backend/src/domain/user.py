import uuid
class User:
    '''
    Constructor
    @param name - the name of the user
    @param email - the email of the user
    @param password - the password of the user
    @param phone - the phone of the user
    @param role - the role of the user
    @param picture - the picture as a string
    '''
    def __init__(self, name: str, email:str, password:str,
        phone:str, role:str, picture:str):
        self.id = uuid.uuid4()
        self.name = name
        self.email = email
        self.password = password
        self.phone = phone
        self.role = role
        self.picture = picture
        self.salt = ""
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,  
            "email": self.email,
            "password":self.password,
            "phone":self.phone,
            "role":self.role,
            "picture":self.picture,
            "salt":self.salt
        }
    
    def set_salt(self, salt:str):
        self.salt = salt

    def get_salt(self):
        return self.salt
