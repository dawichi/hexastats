import requests
import config

def summoner(summoner_name, base_url):
    '''Get summoner information'''
    url = f'{base_url}/summoner/v4/summoners/by-name/{summoner_name}'

    return requests.get(url, headers=config.headers).json()
