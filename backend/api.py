''' API Endpoints for RIOT'''

import os
import requests
from dotenv import load_dotenv

load_dotenv()

riot_token = os.environ.get('RIOT_API_KEY')

# Set headers
headers = {
    'X-Riot-Token': riot_token,
}

def summoner(summoner_name, base_url):

    ''' Returns the basic data from a player'''

    url = f'{base_url}/summoner/v4/summoners/by-name/{summoner_name}'

    response = requests.get(url, headers=headers)

    return response.json()

def summoner_league(summoner_id, base_url):

    ''' Returns the rank data from a player'''

    url = f'{base_url}/league/v4/entries/by-summoner/{summoner_id}'

    resp = requests.get(url, headers=headers).json()

    return {
        'solo':{
            'rank': f"{resp[0]['tier']} {resp[0]['rank']}" if resp[0]['tier'] else 'Unranked',
            'image': f"/images/league-emblems/{resp[0]['tier']}.png" if resp[0]['tier'] else '/images/league-emblems/Unranked.png',
            'lp': resp[0]['leaguePoints'],
            'win': resp[0]['wins'],
            'lose': resp[0]['losses'],
            'winrate': int((resp[0]['wins']/(resp[0]['wins']+resp[0]['losses'])) * 100) if resp[0]['wins'] and resp[0]['losses'] else 0 ,
        },
        'flex':{
            'rank': f"{resp[1]['tier']} {resp[1]['rank']}" if resp[1]['tier'] else 'Unranked',
            'image': f"/images/league-emblems/{resp[1]['tier']}.png" if resp[1]['tier'] else '/images/league-emblems/Unranked.png',
            'lp': resp[1]['leaguePoints'],
            'win': resp[1]['wins'],
            'lose': resp[1]['losses'],
            'winrate': int((resp[1]['wins']/(resp[1]['wins']+resp[1]['losses'])) * 100) if resp[1]['wins'] and resp[1]['losses'] else 0 ,
        },
    }
