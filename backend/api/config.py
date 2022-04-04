''' API Endpoints for RIOT'''

import os
from dotenv import load_dotenv


# Get the API key from the .env file
load_dotenv()
riot_token = os.environ.get('RIOT_API_KEY')


def init():
    ''' Set headers for the API call '''
    global headers 
    headers = {
        'X-Riot-Token': riot_token,
    }
