''' Helper functions '''

def validate_server(server):
    '''
    Function to check if the server is valid
    @param server: server from which the player is
    '''
    servers = ['euw1', 'br1', 'eun1', 'jp1','kr', 'la1', 'la2', 'na1', 'oc1', 'ru', 'tr1']

    if server in servers:
        return server
    return servers[0]
