'''Flask module to create the API'''
from flask import Flask, request
from app.summoner import get_summoner_data


app = Flask(__name__)


# Set headers
@app.after_request
def after_request(res):
    '''Set headers for each request.'''
    res.headers["Access-Control-Allow-Origin"] = "*" # <- You can set a domain: "http://localhost"
    res.headers["Access-Control-Allow-Credentials"] = "true"
    res.headers["Access-Control-Allow-Methods"] = "GET"
    res.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
    return res


default_error = {
    'code': 400,
    'data': None,
    'error': 'Missing Summoner Name in path',
}


@app.route('/', methods=['GET'])
def index():
    '''Default endpoint if no path is specified'''
    return default_error, 400


@app.route("/<string:summoner_name>", methods=['GET'])
def summoner(summoner_name):
    '''
    Endpoint to get summoner information
    @param summoner_name: Summoner name to get information about
    @param region: Specified server to get information from
    '''
    # Exception handling for favicon.ico
    if summoner_name == 'favicon.ico':
        return default_error, 400

    # Validate the server
    servers = ['euw1', 'br1', 'eun1', 'jp1','kr', 'la1', 'la2', 'na1', 'oc1', 'ru', 'tr1']
    server_req = request.args.get('server')
    server = server_req if server_req in servers else servers[0]

    # Get summoner information
    try:
        return get_summoner_data(summoner_name, server)
    except Exception as err:
        return {
            'code': 400,
            'data': None,
            'error': str(err),
        }, 400
