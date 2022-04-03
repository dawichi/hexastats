'''Gets the data from the RIOT API'''

import os
import requests
from dotenv import load_dotenv

def get_data(summoner_name, server):
    '''
    Function to get data from the RIOT API
    @param summoner_name: Summoner name to get information about
    @param server: Specified server to get information from
    '''
    base_url = f'https://{server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}'

    load_dotenv()

    riot_token = os.environ.get('RIOT_API_KEY')

    # Set headers
    headers = {
        'X-Riot-Token': riot_token,
    }

    response = requests.get(base_url, headers=headers)
    return {
        'code': 200,
        'data': response.json(),
        'error': None,
    }
