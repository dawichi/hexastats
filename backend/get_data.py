'''Gets the data from the RIOT API'''

from api import summoner, league, mastery, latest_version
from utils import ApiError


def get_data(summoner_name, server):
    '''
    Function to get data from the RIOT API
    @param summoner_name: Summoner name to get information about
    @param server: Specified server to get information from
    '''
    base_url = f'https://{server}.api.riotgames.com/lol'

    # 1.Get profile information from the player
    summoner_data = summoner.summoner(summoner_name, base_url)

    if 'status' in summoner_data:
        raise ApiError('Summoner not found')

    # 2.Get league by id
    league_data = league.league(summoner_data['id'], base_url)

    # 3.Get masteries by id

    mastery_data = mastery.mastery(summoner_data['id'], base_url)


    summoner_response = {
        'alias': summoner_data['name'],
        'level': summoner_data['summonerLevel'],
        'image': f"https://ddragon.leagueoflegends.com/cdn/{latest_version.latest_version()}/img/profileicon/{summoner_data['profileIconId']}.png",
        'rank': {
            'solo': league_data['solo'],
            'flex': league_data['flex'],
        },
        'masteries': mastery_data
    }

    return {
        'code': 200,
        'data': summoner_response,
        'error': None,
    }
