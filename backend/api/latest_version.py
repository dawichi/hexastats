import requests
import config

def latest_version():
    '''
    Function to obtain the latest version of the game
    in order to access the updated data
    '''
    versions = 'https://ddragon.leagueoflegends.com/api/versions.json'

    return  requests.get(versions, headers=config.headers).json()[0]

