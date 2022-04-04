''' Helper functions '''


class ApiError(Exception):
    '''Custom error class for API errors'''


def validate_server(server):
    '''
    Function to check if the server is valid
    @param server: server from which the player is
    '''
    servers = ['euw1', 'br1', 'eun1', 'jp1','kr', 'la1', 'la2', 'na1', 'oc1', 'ru', 'tr1']

    if server in servers:
        return server
    return servers[0]


def real_name(alias):
    '''
    Function to identify a close friend from a private list
    @param alias: Summoner name to check
    '''
    players = {
		'alexwwe': 'Alex',
		'Brr1': 'Bruno',
		'BloddSword': 'Cristian',
		'Dawichii': 'Dawid',
		'Agazhord': 'Marcos',
		'Traketero': 'Rodri',
		'DryadZero': 'Samu',
		'Rhaast West': 'Diego',
		'DelemKi 26': 'Abel',
		'DAYTRESGP': 'David',
		'Telejenkem': 'Jose',
		'Ruzou': 'Ruben',
    }
    try:
        return players[alias]
    except KeyError:
        return alias
