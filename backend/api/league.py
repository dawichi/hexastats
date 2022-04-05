import requests
import config

def league(summoner_id, base_url):
    '''Get summoner league information'''
    url = f'{base_url}/league/v4/entries/by-summoner/{summoner_id}'

    resp = requests.get(url, headers=config.headers).json()

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