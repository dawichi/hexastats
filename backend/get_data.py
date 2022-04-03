'''Gets the data from the RIOT API'''

from api import summoner, summoner_league

def get_data(summoner_name, server):
    '''
    Function to get data from the RIOT API
    @param summoner_name: Summoner name to get information about
    @param server: Specified server to get information from
    '''
    base_url = f'https://{server}.api.riotgames.com/lol'

    # 1.Get profile information from the player

    summoner_data = summoner(summoner_name, base_url)

    # 2.Get league by id

    league_data = summoner_league(summoner_data['id'], base_url)

    summoner_response = {
        'id': summoner_data['id'],
        'data':{
            'name': summoner_data['name'],
            'level': summoner_data['summonerLevel'],
            'image': f"https://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/{summoner_data['profileIconId']}.png"
        },
        'rank': {
            'solo': league_data['solo'],
            'flex': league_data['flex'],
        }
    }
    return {
        'code': 200,
        'data': summoner_response,
        'error': None,
    }
