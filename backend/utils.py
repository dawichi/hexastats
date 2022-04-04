''' Helper functions '''

import os
import requests
from dotenv import load_dotenv

load_dotenv()
riot_token = os.environ.get('RIOT_API_KEY')

headers = {
    'X-Riot-Token': riot_token,
}

class ApiError(Exception):
    '''Custom error class for API errors'''


def validate_server(server):
    '''
    Function to check if the server is valid
    @param server: server from which the player is
    '''
    servers = ['euw1', 'br1', 'eun1', 'jp1','kr', 'la1', 'la2', 'na1', 'oc1', 'ru', 'tr1']

    if server in servers:
        return server
    return servers[0]


def latest_version():
    '''
    Function to obtain the latest version of the game
    in order to access the updated data
    '''
    versions = 'https://ddragon.leagueoflegends.com/api/versions.json'

    return  requests.get(versions, headers=headers).json()[0]


def champion_name(champion_id):
    '''
    Function to obtain the champion's name by its Id
    @param championId: Id of the champion
    '''
    champion_url = f'http://ddragon.leagueoflegends.com/cdn/{latest_version()}/data/en_US/champion.json'

    champion_data = requests.get(champion_url, headers=headers).json()['data']

    for key,value in champion_data.items():
        if value['key'] == str(champion_id):
            return key
