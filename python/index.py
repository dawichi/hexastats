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
    server_req = request.args.get('server')
    validate_server = {
        'euw' : 'euw1',
        'eune' : 'eune1',
        'ru' : 'ru',
        'jp' : 'jp1',
        'kr' : 'kr',
        'br' : 'br1',
        'na' : 'na1',
        'tr' : 'tr1',
        'oce' : 'oc1',
        'lan' : 'la1',
        'las' : 'la2',
    }
    server = validate_server[server_req] if server_req in validate_server else validate_server['euw']

    # Get summoner information
    try:
        return get_summoner_data(summoner_name, server)
    except Exception as err:
        return {
            'code': 400,
            'data': None,
            'error': str(err),
        }, 400
