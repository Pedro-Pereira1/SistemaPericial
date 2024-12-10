from enum import Enum

class Category(Enum):
    BENIGN='Benign'
    BOTNET='Botnet'
    BRUTEFORCE='Bruteforce'
    DOS='DoS'
    DDOS='DDoS'
    INFILTRATION='Infiltration'
    PORTSCAN='Portscan'
    WEBATTACK='Webattack'