/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { Player } from '../interfaces/interfaces'
import getStatValues from '../utils/getStatValues'
import trophyIcon from '../utils/trophyIcon'
import ChartCard from '../components/ChartCard'

// ┌────────────────┐
// │  GRAPHS PAGE:  │
// └────────────────┘
// Process the data with 'process()' function to get the specific
// stats of each category and pass the filtered information to the <PieChart/> components
const Graphs = ({data}) => {

	// Trophies counter for each player
	const rank_results = []
	data.map((player: Player) => {
		rank_results.push({
			name: player.name,
			image: player.image,
			trophies: [],
		})
	})

	// We get our different data throw or getStatValues() function
	// This function also fills the rank_results[] values!!!
	const [gamesplayed, gamesplayed_int] = getStatValues(data, rank_results, 'games', false, false, false)
	const [winrates, winrates_int] = getStatValues(data, rank_results, 'winrate', true, true, false)
	const [kda, kda_int] = getStatValues(data, rank_results, 'kda', true, true, false)
	const [kills, kills_int] = getStatValues(data, rank_results, 'kills', true, true, false)
	const [deaths, deaths_int] = getStatValues(data, rank_results, 'deaths', true, true, true)
	const [assists, assists_int] = getStatValues(data, rank_results, 'assists', true, true, false)
	const [minions, minions_int] = getStatValues(data, rank_results, 'cs', true, true, false)
	const [csmin, csmin_int] = getStatValues(data, rank_results, 'csmin', true, true, false)

	const charts = [
		{title: 'Games played', data: gamesplayed, data_int: gamesplayed_int},
		{title: 'Winrate', data: winrates, data_int: winrates_int},
		{title: 'KDA', data: kda, data_int: kda_int},
		{title: 'Kills', data: kills, data_int: kills_int},
		{title: 'Deaths', data: deaths, data_int: deaths_int},
		{title: 'Assists', data: assists, data_int: assists_int},
		{title: 'Farm total', data: minions, data_int: minions_int},
		{title: 'CS / Min', data: csmin, data_int: csmin_int},
	]

	// Sorts player's trophies by value (so it shows 1º, 2º and 3º cups in correct order)
	rank_results.map(card => card.trophies.sort(function(a, b) {return a - b}))

	return (
		<>
			<div className="container-fluid">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
					{ rank_results.map((card, indx_card) => 
						<div key={indx_card}>
							<div className="bg-gray-200 p-1 m-2 shadow border">
								<div className="flex">
									<img className="m-2 w-14 h-14 rounded" src={card.image} alt={card.name} />
									<div className="flex flex-col">
										<span className="pb-1 text-xl">{card.name}</span>
										<div className="mr-1">{card.trophies.map((x: number) => trophyIcon(x))}</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="container mx-auto">
				<h2 className="text-4xl text-center mt-10 mb-5">Graphs by stat</h2>
				<hr/>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
					{charts.map((x, index) => <ChartCard key={index} id={index+1} title={x.title} data={x.data} data_int={x.data_int} />)}
				</div>
			</div>
		</>
	)
}

export default Graphs