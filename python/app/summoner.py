'''Gets the data from the RIOT API'''

from app.api import summoner, league, mastery, version
from app.opgg import scraper

class ApiError(Exception):
    '''Custom error class for API errors'''


def get_summoner_data(summoner_name, server):
    '''
    Function to get data from the RIOT API
    @param summoner_name: Summoner name to get information about
    @param server: Specified server to get information from
    '''
    base_url = f'https://{server}.api.riotgames.com/lol'

    # 1.Get profile information from the player
    summoner_data = summoner(summoner_name, base_url)

    if 'status' in summoner_data:
        raise ApiError('Summoner not found')

    # 2.Get league by id
    league_data = league(summoner_data['id'], base_url)

    # 3.Get masteries by id
    mastery_data = mastery(summoner_data['id'], base_url)

    # 4.Get champs data
    champs_data = scraper(summoner_name, server)


    summoner_response = {
        'alias': summoner_data['name'],
        'level': summoner_data['summonerLevel'],
        'image': f"https://ddragon.leagueoflegends.com/cdn/{version()}/img/profileicon/{summoner_data['profileIconId']}.png",
        'rank': {
            'rank_n': 0,
            'rank_p': 100,
            'solo': league_data['solo'],
            'flex': league_data['flex'],
        },
        'masteries': mastery_data,
        'champs':champs_data
    }

    return {
        'code': 200,
        'data': summoner_response,
        'error': None,
    }
