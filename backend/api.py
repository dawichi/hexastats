''' API Endpoints for RIOT'''

import os
import requests
from dotenv import load_dotenv


# Get the API key from the .env file
load_dotenv()
riot_token = os.environ.get('RIOT_API_KEY')


# Set headers for the API call
headers = {
    'X-Riot-Token': riot_token,
}


def summoner(summoner_name, base_url):
    '''Get summoner information'''
    url = f'{base_url}/summoner/v4/summoners/by-name/{summoner_name}'

    return requests.get(url, headers=headers).json()


def summoner_league(summoner_id, base_url):
    '''Get summoner league information'''
    url = f'{base_url}/league/v4/entries/by-summoner/{summoner_id}'

    resp = requests.get(url, headers=headers).json()

    def rank(i):
        '''Get rank of summoner'''
        return {
            'rank': f"{resp[i]['tier']} {resp[i]['rank']}" if resp[i]['tier'] else 'Unranked',
            'image': f"/images/league-emblems/{resp[i]['tier']}.png" if resp[i]['tier'] else '/images/league-emblems/Unranked.png',
            'lp': resp[i]['leaguePoints'],
            'win': resp[i]['wins'],
            'lose': resp[i]['losses'],
            'winrate': int((resp[i]['wins']/(resp[i]['wins']+resp[i]['losses'])) * 100) if resp[i]['wins'] and resp[i]['losses'] else 0 ,
        }

    return {
        'solo': rank(0),
        'flex': rank(1),
    }
