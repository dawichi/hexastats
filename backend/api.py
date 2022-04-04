''' API Endpoints for RIOT'''

import os
import requests
from dotenv import load_dotenv
from utils import champion_name, latest_version


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


def league(summoner_id, base_url):
    '''Get summoner league information'''
    url = f'{base_url}/league/v4/entries/by-summoner/{summoner_id}'

    resp = requests.get(url, headers=headers).json()

    default = {
        'rank': 'Unranked',
        'image': '/images/league-emblems/Unranked.png',
        'lp': 0,
        'win': 0,
        'lose': 0,
        'winrate': 0,
    }

    def winrate(wins,losses):
        return  int((wins/(wins+losses)) * 100) if wins and losses else 0

    def rank(i):
        '''Get rank of summoner'''
        return {
            'rank': f"{resp[i]['tier']} {resp[i]['rank']}" if resp[i]['tier'] else 'Unranked',
            'image': f"/images/league-emblems/{resp[i]['tier']}.png" if resp[i]['tier'] else '/images/league-emblems/Unranked.png',
            'lp': resp[i]['leaguePoints'],
            'win': resp[i]['wins'],
            'lose': resp[i]['losses'],
            'winrate': winrate(resp[i]['wins'], resp[i]['losses']) ,
        }

    if len(resp) == 0:
        return {
            'solo': default,
            'flex': default,
        }
    if len(resp) == 1:
        if resp[0]['queueType'] == 'RANKED_SOLO_5x5':
            return {
                'solo': rank(0),
                'flex': default,
            }
        return {
                'solo': default,
                'flex': rank(0),
        }

    return {
        'solo': rank(0),
        'flex': rank(1),
    }

def mastery(summoner_id, base_url):
    '''Get champions mastery information'''
    url = f'{base_url}/champion-mastery/v4/champion-masteries/by-summoner/{summoner_id}'

    resp = requests.get(url, headers=headers).json()

    masteries = []

    for i in range(7):

        name = champion_name(resp[i]['championId'])

        masteries.append({
            'name': name,
            'image': f"http://ddragon.leagueoflegends.com/cdn/{latest_version()}/img/champion/{name}.png",
            'level': resp[i]['championLevel'],
            'points': resp[i]['championPoints']
        })

    return masteries
