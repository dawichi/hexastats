<h1 align="center">Hexastats</h1>

<div align="center">
    <img src="https://img.shields.io/badge/made%20with-next%20js-black" />
    <img src="https://img.shields.io/badge/made%20with-typescript-blue" />
    <img src="https://img.shields.io/badge/made%20with-tailwindcss-ff69b4" />
    <img src="https://img.shields.io/badge/made%20with-python-blue" />
    <img src="https://img.shields.io/badge/made%20with-flask-green" />
</div>
<p align="center">Web application to allow players to visualize their data from League of Legends.</p>
<p align="center">🎉🎉🎉 Check it on <a href="https://hexastats.vercel.app" target="_blank">hexastats.vercel.app</a> 🎉🎉🎉</p>


The project is a monorepo consisted in:

* [`/frontend`](https://github.com/dawichi/hexastats/tree/main/frontend)  NextJS app
* [`/backend`](https://github.com/dawichi/hexastats/tree/main/backend) Python API (flask)



## Description

Hexastats allows you to enter multiple usernames, giving you a fast, visual and interactive way to compare data between players.

## Last features

* Dark mode
* Players data remains after browser refresh
* Masteries page

## Incoming features

* Faster load for players data
* Integration with League of Legends desktop client
* Automatic load of player names once you enter in a new game, to give you statics of both teams

## Technical approach
When a backend endpoint is called with a username, it loads, packages and serves the information in JSON to the frontend. The data is loaded into React Context and managed to visualize the stats through multiple different ways with graphs from [D3.js](https://d3js.org/)

For more specific info, browse both [`/frontend`](https://github.com/dawichi/hexastats/tree/main/frontend) and [`/backend`](https://github.com/dawichi/hexastats/tree/main/backend).




---

![showcase](https://raw.githubusercontent.com/Dawichi/hexastats/main/showcase.png)


![showcase](https://raw.githubusercontent.com/Dawichi/hexastats/main/frontend/public/images/mastery.png)


![showcase](https://raw.githubusercontent.com/Dawichi/hexastats/main/frontend/public/images/compare.png)

