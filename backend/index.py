'''Flask module to create the API'''
from flask import Flask, request
from get_data import get_data
from utils import validate_server


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

error = {
        'code': 400,
        'data': None,
        'error': 'Missing Summoner Name in path',
    }

@app.route('/', methods=['GET'])
def index():
    '''Default endpoint if no path is specified'''

    return error,400


@app.route("/<string:summoner_name>", methods=['GET'])
def summoner(summoner_name):
    '''
    Endpoint to get summoner information
    @param summoner_name: Summoner name to get information about
    @param region: Specified server to get information from
    '''
    if summoner_name == 'favicon.ico':
        return error, 400
    server = validate_server(request.args.get('server'))
    return get_data(summoner_name, server)
