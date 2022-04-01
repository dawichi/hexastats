from flask import Flask, Response

app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*" # <- You can change "*" for a domain for example "http://localhost"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"
    return response


@app.route('/', methods=['GET'])
def home():
    error = {
        'code': 400,
        'error': 'Missing Summoner Name in path',
    }
    return error,400

@app.route("/<string:summonerName>", methods=['GET'])
def summoner(summonerName):
    player = {
        'name': summonerName
    }
    return player,200