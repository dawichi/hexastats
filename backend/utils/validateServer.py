def validate_server(server):
	servers = ['euw', 'lan', 'las', 'na','eune', 'tr', 'oce', 'ru', 'jp', 'br']
	if server == 'kr':
		return 'www'
	elif server in servers:
		return server
	else:
		return servers[0]