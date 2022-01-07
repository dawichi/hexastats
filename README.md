<h1 align="center">Hexastats</h1>

<div align="center">
  <img src="https://img.shields.io/badge/made%20with-next%20js-black" /><span> </span><img src="https://img.shields.io/badge/made%20with-typescript-blue" /><span> </span><img src="https://img.shields.io/badge/made%20with-tailwindcss-ff69b4" />
</div>

[NextJS]([Next.js by Vercel - The React Framework (nextjs.org)](https://nextjs.org/)) frontend application to visualize data from League of Legends stats.



#### Description

Using `getStaticProps` function from Next, it caches the JSON data from our [backend 'hexastats-flask' (a python flask app)]([Brr1-99/hexastats-flask (github.com)](https://github.com/Brr1-99/hexastats-flask)).
The data is loaded into React Context object and managed to visualize the stats through multiple different ways with graphs from [D3.js]([D3.js - Data-Driven Documents (d3js.org)](https://d3js.org/))

* Some data we can manage right now: [`interface Player { }`]([hexastats/player.ts at main · Dawichi/hexastats (github.com)](https://github.com/Dawichi/hexastats/blob/main/interfaces/player.ts))



🎉🎉🎉 Check it on [hexastats.vercel.app](https://hexastats.vercel.app)

---

![showcase](https://raw.githubusercontent.com/Dawichi/hexastats/main/showcase.png)


![showcase](https://raw.githubusercontent.com/Dawichi/hexastats/main/public/images/showcase2.png)


![showcase](https://raw.githubusercontent.com/Dawichi/hexastats/main/public/images/showcase3.png)

