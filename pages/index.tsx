/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Axios from 'axios'
import Navbar from '../components/Navbar'
import { realName, processData } from '../utils'
import { Compare, Graphs, Home, Ranking } from '../sections'
import { Player } from '../interfaces/interfaces'

// ┌────────────────┐
// │  INDEX PAGE:   │
// └────────────────┘
// Hexastats is a one-page app
// To navigate throgh the sections, is used a basic array with the sections available sections[]
// Based on the selected section, each component is showed in the <main> tag of the app
export default function Index(props: { data: any[] }) {

	// process the props.data to format the output into players_data
	const players_data: Player[] = processData(props.data)
	const [currentSection, setCurrentSection] = useState(0)

	// Sections available
	// If you add a new section, remember modify also the navigation menu to be able to select its index
	const sections = [
		<Home key={0} data={players_data} />,
		<Graphs key={1} data={players_data} />,
		<Ranking key={2} data={players_data} />,
		<Compare key={3} data={players_data} />,
	]

	return (
		<>
			<header style={{position: 'sticky', top: 0, zIndex: 1}}>
				<Navbar page={currentSection} setPage={setCurrentSection} />
			</header>

			<main className="pb-20 bg-orange-50 dark:bg-zinc-900 dark:text-white">
				<div className="animate__animated animate__fadeIn">
					{ sections[currentSection] }
				</div>
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
		'Ruzou'
	]

	// TODO: im fucking unable to factorize this because of async axios delays too much for getStaticProps if I do: // players.forEach( async player => { ... })

	const player0 = await Axios.get(BASE_URL + players[0])
	const player1 = await Axios.get(BASE_URL + players[1])
	const player2 = await Axios.get(BASE_URL + players[2])
	const player3 = await Axios.get(BASE_URL + players[3])
	const player4 = await Axios.get(BASE_URL + players[4])
	const player5 = await Axios.get(BASE_URL + players[5])
	const player6 = await Axios.get(BASE_URL + players[6])
	const player7 = await Axios.get(BASE_URL + players[7])
	const player8 = await Axios.get(BASE_URL + players[8])
	const player9 = await Axios.get(BASE_URL + players[9])
	const player10 = await Axios.get(BASE_URL + players[10])
	const player11 = await Axios.get(BASE_URL + players[11])

	const data = [
		{name: realName(players[0]), data: player0.data, alias: players[0]},
		{name: realName(players[1]), data: player1.data, alias: players[1]},
		{name: realName(players[2]), data: player2.data, alias: players[2]},
		{name: realName(players[3]), data: player3.data, alias: players[3]},
		{name: realName(players[4]), data: player4.data, alias: players[4]},
		{name: realName(players[5]), data: player5.data, alias: players[5]},
		{name: realName(players[6]), data: player6.data, alias: players[6]},
		{name: realName(players[7]), data: player7.data, alias: players[7]},
		{name: realName(players[8]), data: player8.data, alias: players[8]},
		{name: realName(players[9]), data: player9.data, alias: players[9]},
		{name: realName(players[10]), data: player10.data, alias: players[10]},
		{name: realName(players[11]), data: player11.data, alias: players[11]},
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
