<h1 align="center">Hexastats</h1>

<div align="center">
  <img src="https://img.shields.io/badge/made%20with-next%20js-black" /><span> </span><img src="https://img.shields.io/badge/made%20with-typescript-blue" /><span> </span><img src="https://img.shields.io/badge/made%20with-tailwindcss-ff69b4" />
</div>

<p align="center">Web application to allow players to visualize their data from League of Legends.</p`>
---

The project is a monorepo consisted in:

* `/frontend`  NextJS app
* `/backend` Python (flask) API



#### Description

Using `getStaticProps` function from Next, it caches the JSON data from our backend [Brr1-99/hexastats-flask](https://github.com/Brr1-99/hexastats-flask) (a python flask app).
The data is loaded into React Context object and managed to visualize the stats through multiple different ways with graphs from [D3.js](https://d3js.org/)

* Scheme of the data we can manage right now: [`interface Player { }`](https://github.com/Dawichi/hexastats/blob/main/interfaces/player.ts)



🎉🎉🎉 Check it on [hexastats.vercel.app](https://hexastats.vercel.app)

---

![showcase](https://raw.githubusercontent.com/Dawichi/hexastats/main/showcase.png)


![showcase](https://raw.githubusercontent.com/Dawichi/hexastats/main/public/images/showcase2.png)


![showcase](https://raw.githubusercontent.com/Dawichi/hexastats/main/public/images/showcase3.png)

