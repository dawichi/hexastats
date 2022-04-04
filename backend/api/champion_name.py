import requests
import config
from latest_version import latest_version

def champion_name(champion_id):
    '''
    Function to obtain the champion's name by its Id
    @param championId: Id of the champion
    '''
    champion_url = f'http://ddragon.leagueoflegends.com/cdn/{latest_version()}/data/en_US/champion.json'

    champion_data = requests.get(champion_url, headers=config.headers).json()['data']

    for key,value in champion_data.items():
        if value['key'] == str(champion_id):
            return key
