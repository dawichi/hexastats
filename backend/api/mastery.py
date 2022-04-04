import requests
import config
from latest_version import latest_version
from champion_name import champion_name


def mastery(summoner_id, base_url):
    '''Get champions mastery information'''
    url = f'{base_url}/champion-mastery/v4/champion-masteries/by-summoner/{summoner_id}'

    resp = requests.get(url, headers=config.headers).json()

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
