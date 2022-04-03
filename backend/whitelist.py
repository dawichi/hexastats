'''  Close friend alias recogniser '''

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
