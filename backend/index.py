from flask import Flask, request
import json


app = Flask(__name__)


# Modify every request to include headers for CORS
@app.after_request
def after_request(response):
    # You can change "*" for a domain for example "http://localhost"
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"
    return response


@app.route("/", methods=['GET'])
def home():
    try:
        players = request.args.get('players')
        server = request.args.get('server')

        # Probably not correct data
        if len(players) < 3:
            players = []

        # Remove end comma if exists
        elif players[-1] == ',':
            players = players[:-1]

        # Now everything is ok, split the players
        players = players.split(',')


        # singleMode: ?players=Bruno&server=euw
        # multiMode: ?players=Bruno,Alex&server=euw
        isSingleMode = len(players) == 1

        # Everything went ok: process the data
        # data = getData(players, server, isSingleMode)
        data = []
        return 'data'

    except (AttributeError , IndexError , TypeError):
        return []
