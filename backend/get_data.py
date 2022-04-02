'''Gets the data from the RIOT API'''
def get_data(summoner_name, server):
    '''
    Function to get data from the RIOT API
    @param summoner_name: Summoner name to get information about
    @param server: Specified server to get information from
    '''
    # Set headers
    headers = {
        'X-Riot-Token': 'RGAPI-b9f9f8f6-f8f8-4f7f-b9f9-f9f9f9f9f9f9',
    }
    print('omg')
    return {
        'code': 200,
        'data': {
            'summonerName': summoner_name,
            'server': server,
        },
        'error': None,
    }
    # Set url
    url = 'https://' + server + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summoner_name
    # Get data
    # response = requests.get(url, headers=headers)
    # Return data
    # return response.json()
