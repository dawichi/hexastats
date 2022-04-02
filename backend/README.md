<h1 align="center">Hexastats</h1>

<div align="center">
  </span><img src="https://img.shields.io/badge/made%20with-python-blue" /><span> <img src="https://img.shields.io/badge/made%20with-flask-green" />
</div>

Backend API made with Flask. Gets the data from Riot servers and serves it through an endpoint for each player as JSON.



<h2 align="center">API Documentation</h2>

#### GET: Player data by SummonerName 

````python
@param Name # in path
/<Name>

# Example:  api.hexastats.com/Tony
# @returns JSON object
{
    # player data
}
````




#### GET: Specify server

If you want to search for a player in a specific server (euw, kr, etc...) just add a `server=` query param

````python
@param Name # in path
@param Server # in query
/<Name>?server=<Server>

# Example: api.hexastats.com/Alex?server=euw
# @returns JSON object
{
    # player data
}
````



## Local Setup

Setup a local environment for development

```shell
(master) $ py -m venv venv # create local virtual environment

(master) $ source venv/bin/activate # activation in Linux / MacOS
(master) $ .\venv\Scripts\activate # activation Windows

(venv) (master) $ pip install -r requirements.txt # Install dependencies
(venv) (master) $ $env:FLASK_APP="index.py" # Provide the entry point
(venv) (master) $ flask run # Run the server
```
