from datetime import datetime
import random

async def random_full_date_last_month():
    today = datetime.now()
    current_year = today.year
    current_month = today.month
    
    if current_month == 1:
        last_month = 12
        year = current_year - 1
    else:
        last_month = current_month - 1
        year = current_year
    
    days_in_month = {
        1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
        7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
    }
    
    if last_month == 2 and ((year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)):
        days_in_month[2] = 29
    
    day = random.randint(1, days_in_month[last_month])
    
    hour = random.randint(0, 23)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    
    return datetime(year, last_month, day, hour, minute, second)
