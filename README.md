<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
<!-- ------------------------------------------------------------------------------------------------------------------------ -->


<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="./frontend/public/images/logo.png" alt="Logo" width="80" height="80"/>
    <h1 align="center">Hexastats</h1>
    <p align="center">Visualize your stats and metrics from League of Legends!</p>
    <p align="center">🎉 Check it on <a href="https://hexastats.vercel.app" target="_blank">hexastats.vercel.app</a> 🎉</p>
</div>
<br/>

The project is a monorepo consisted in:

* [`/frontend`](https://github.com/dawichi/hexastats/tree/main/frontend)  SveteKit App
* [`/backend`](https://github.com/dawichi/hexastats/tree/main/backend) API in Nest JS
<!-- ------------------------------------------------------------------------------------------------------------------------ -->



<!-- TABLE OF CONTENTS -->
<br/>
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About the project</a></li>
    <li>
      <a href="#technical-approach">Technical approach</a>
      <ul>
        <li><a href="#built-with">Built with</a></li>
      </ul>
    </li>
    <li>
      <a href="#local-setup">Local setup</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#setup-frontend">Setup: frontend</a></li>
        <li><a href="#setup-backend">Setup: backend</a></li>
      </ul>
    </li>
    <li><a href="#gallery">Gallery</a></li>
  </ol>
</details>
<br/>
<!-- ------------------------------------------------------------------------------------------------------------------------ -->



<!-- ABOUT -->
## About the project

Hexastats is a web app to visualize your metrics from League of Legends.  
* Last games performance, winrates, graphs and more! 🔥  
* It allows you to enter multiple usernames, giving you a fast, visual and interactive way to compare data between players.

[![Hexastats][showcase-1]][hexastats-url]

The project was born from the need to compare data between players in a fast and interactive way.  
First, we created a basic script that eventually turned into a small API to play with some stats from our accounts and compare them.

Eventually, more people wanted to be added to try it, so we turned the project into a web with search system, so everyone could add their own username and their friends to make comparisons and have fun.

Right now, we keep working on it, adding new features, sections and thinking about new ways to compare data!

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<!-- ------------------------------------------------------------------------------------------------------------------------ -->



<!-- BUILT WITH -->
## Technical approach
When the API is called with an username, it loads and serves the JSON data to the frontend. The client loads the data into a SvelteKit store (equivalent to React context) from where can be accessed by each page to display and visualize different information depending of the page.

### General diagram of the project:
![](frontend/static/images/diagram.png)

### NestJS specific diagram:
![](backend/backend-diagram.png)

For more specific info, browse both [`/frontend`](https://github.com/dawichi/hexastats/tree/main/frontend) and [`/backend`](https://github.com/dawichi/hexastats/tree/main/backend) code.

### Built With

It has been written entirely in TypeScript, using the latest solid frameworks such as Next.js for frontend and Nest for backend.

* [![TypeScript][TypeScript]][TypeScript-url]
* [![Node][Node.js]][Node-url]
* [![Nest][Nest.js]][Nest-url]
* [![Redis][Redis]][Redis-url]
<!-- ------------------------------------------------------------------------------------------------------------------------ -->



<!-- LOCAL SETUP -->
<br/>
<br/>

## Local setup

Instructions to setup the project locally:

### Prerequisites

To run the project locally, you need:

* Frontend running
* Backend running
* Redis running (optional, it's only a cache)

<br/>

### Setup: frontend

Move to `frontend/` folder, install dependencies and run the project
```sh
~/hexastats/ $ cd frontend
~/hexastats/frontend/ $ npm install # or yarn, or pnpm
~/hexastats/frontend/ $ npm run dev
```

In `frontend/.env` file you can setup
```env
PUBLIC_IS_DEVELOPMENT = 'true'
```
This will make the calls to `http://localhost:5000/`, local backend  
If not, it will call `https://api-hexastats.vercel.app/`, the production URL

<br/>

### Setup: backend

Move to `frontend/` folder, install dependencies and run the project
```sh
~/hexastats/ $ cd backend
~/hexastats/backend/ $ npm install # or yarn, or pnpm
~/hexastats/backend/ $ npm run dev
```

To setup the environment, copy `backend/.env.example` file to `backend/.env` and fill the variables

* If you don't have a Riot API key, you can get one [here](https://developer.riotgames.com/)

* If you don't have a Upstash redis instance, you can get one [here](https://upstash.com/)  
Or you could disable it by setting `UPSTASH_REDIS_REST_DISABLE = true`


<p align="right">(<a href="#readme-top">back to top</a>)</p>
<!-- ------------------------------------------------------------------------------------------------------------------------ -->

## Last features

* Dark mode
* Players data remains after browser refresh
* Masteries page

## Incoming features

* Faster load for players data
* Integration with League of Legends desktop client
* Automatic load of player names once you enter in a new game, to give you statics of both teams





---

## Gallery

Some images from the project:

![Hexastats][showcase-2]

![Hexastats][showcase-3]

![Hexastats][showcase-4]


<!-- ------------------------------------------------------------------------------------------------------------------------ -->
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[hexastats-url]: https://hexastats.vercel.app

<!-- HEADER STUFF -->
[contributors-shield]: https://img.shields.io/github/contributors/dawichi/hexastats.svg?style=for-the-badge
[contributors-url]: https://github.com/dawichi/hexastats/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dawichi/hexastats.svg?style=for-the-badge
[forks-url]: https://github.com/dawichi/hexastats/network/members
[stars-shield]: https://img.shields.io/github/stars/dawichi/hexastats.svg?style=for-the-badge
[stars-url]: https://github.com/dawichi/hexastats/stargazers
[issues-shield]: https://img.shields.io/github/issues/dawichi/hexastats.svg?style=for-the-badge
[issues-url]: https://github.com/dawichi/hexastats/issues
[license-shield]: https://img.shields.io/github/license/dawichi/hexastats.svg?style=for-the-badge
[license-url]: https://github.com/dawichi/hexastats/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=blue
[linkedin-url]: https://linkedin.com/in/dawichi

<!-- IMAGES -->
[showcase-1]: showcase.png
[showcase-2]: frontend/static/images/mastery.png
[showcase-3]: frontend/static/images/graphs.png
[showcase-4]: frontend/static/images/compare.png

<!-- TECH STACK -->
[TypeScript]: https://img.shields.io/github/languages/top/dawichi/hexastats?logo=typescript&logoColor=fff&style=for-the-badge
[TypeScript-url]: https://typescriptlang.org/
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node-333?style=for-the-badge&logo=node.js&logoColor=43853d
[Node-url]: https://nodejs.org/
[Nest.js]: https://img.shields.io/badge/Nest-121212?style=for-the-badge&logo=nestjs&logoColor=ea2845
[Nest-url]: https://nestjs.com/
[Redis]: https://img.shields.io/badge/Redis-0f172a?style=for-the-badge&logo=redis&logoColor=ea2845
[Redis-url]: https://redis.io/
