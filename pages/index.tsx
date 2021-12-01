/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Axios from 'axios'
import Navbar from '../components/Navbar'
import processData from '../utils/processData'
import Home from '../sections/Home'
import Graphs from '../sections/Graphs'
import Ranking from '../sections/Ranking'
import { realName } from '../utils'

export default function Index(props: { data: any[] }) {

	const data = processData(props.data)
	const [page, setPage] = useState(0)

	return (
		<>
			<header style={{position: 'sticky', top: 0, zIndex: 1}}>
				<Navbar page={page} setPage={setPage} />
			</header>

			<main>
				{ page == 0 &&
					<div className="animate__animated animate__fadeIn">
						<Home data={data} />
					</div>
				}
				{ page == 1 &&
					<div className="animate__animated animate__fadeIn">
						<Graphs data={data}/>
					</div>
				}
				{ page == 2 &&
					<div className="animate__animated animate__fadeIn">
						<Ranking data={data}/>
					</div>
				}
				{ page == 3 &&
					<div className="animate__animated animate__fadeIn">
						<div>hi</div> 
					</div>
				}
			</main>
		</>
	)
}


export const getStaticProps = async () => {
	// Fetch data from euw.op.gg with getStaticProps()'s NextJS function
	const BASE_URL = 'https://euw.op.gg/summoner/userName='

	const players = [
		'alexwwe',
		'Brr1',
		'BloddSword',
		'Dawichii',
		'Agazhord',
		'Traketero',
		'DryadZero',
		'Rhaast West',
		'DelemKi 26',
		'DAYTRESGP',
		'Telejenkem',
	]

	// TODO: im fucking unable to factorize this because of async axios delays too much for getStaticProps if I do: // players.forEach( async player => { ... })

	const player0 = await Axios.get(BASE_URL + players[0])
	const player1 = await Axios.get(BASE_URL + players[1])
	const player2 = await Axios.get(BASE_URL + players[2])
	const player3 = await Axios.get(BASE_URL + players[3])
	const player4 = await Axios.get(BASE_URL + players[4])
	const player5 = await Axios.get(BASE_URL + players[5])
	const player6 = await Axios.get(BASE_URL + players[6])
	// const player7 = await Axios.get(BASE_URL + players[7])
	const player8 = await Axios.get(BASE_URL + players[8])
	const player9 = await Axios.get(BASE_URL + players[9])
	// const player10 = await Axios.get(BASE_URL + players[10])

	const data = [
		{name: realName(players[0]), data: player0.data, alias: players[0]},
		{name: realName(players[1]), data: player1.data, alias: players[1]},
		{name: realName(players[2]), data: player2.data, alias: players[2]},
		{name: realName(players[3]), data: player3.data, alias: players[3]},
		{name: realName(players[4]), data: player4.data, alias: players[4]},
		{name: realName(players[5]), data: player5.data, alias: players[5]},
		{name: realName(players[6]), data: player6.data, alias: players[6]},
		// {name: realName(players[7]), data: player7.data, alias: players[7]},
		{name: realName(players[8]), data: player8.data, alias: players[8]},
		{name: realName(players[9]), data: player9.data, alias: players[9]},
		// {name: realName(players[10]), data: player10.data, alias: players[10]},
	]

	data.sort((A, B) => {
		if (A.name < B.name) return -1
		if (A.name > B.name) return 1
		return 0
	})
	return {
		props: { data: data},
	}
}