from colorama import Fore, Back, Style
from datetime import datetime

def print_info(text:str):
    print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | " + Fore.GREEN + "INFO" + Fore.WHITE + f":\t {text}")

def print_warning(text:str):
    print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | " + Fore.YELLOW + "WARNING" + Fore.WHITE + f":\t {text}")

def print_error(text:str):
    print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | " + Fore.RED + "ERROR" + Fore.WHITE + f":\t {text}")