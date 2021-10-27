import React from 'react'
import ChartCard from './ChartCard'

const Graphs = ({data}) => {

	// GAMES PLAYED
	const gamesplayed = []
	const gamesplayed_int = []
	data.map(player => {
		let total_games = 0
		player.champs.map(x => total_games += parseInt(x.games))
		gamesplayed.push({label: player.name, value: total_games})
		gamesplayed_int.push(total_games)
	})
	gamesplayed_int.sort(function(a, b) {return b - a})

	// KDA
	const kda = []
	const kda_int = []
	data.map(player => {
		let total_kda = 0
		player.champs.map(x => total_kda += parseFloat(x.kda))
		kda.push({label: player.name, value: (total_kda/7).toFixed(2)})
		kda_int.push((total_kda/7).toFixed(2))
	})
	kda_int.sort(function(a, b) {return b - a})

	// KILLS
	const kills = []
	const kills_int = []
	data.map(player => {
		let total_kills = 0
		player.champs.map(x => total_kills += parseFloat(x.kills))
		kills.push({label: player.name, value: total_kills.toFixed(2)})
		kills_int.push(total_kills.toFixed(2))
	})
	kills_int.sort(function(a, b) {return b - a})

	// KILLS
	const deaths = []
	const deaths_int = []
	data.map(player => {
		let total_deaths = 0
		player.champs.map(x => total_deaths += parseFloat(x.deaths))
		deaths.push({label: player.name, value: total_deaths.toFixed(2)})
		deaths_int.push(total_deaths.toFixed(2))
	})
	kills_int.sort(function(a, b) {return a - b})

	return (
		<div className="container">
			<div className="row">
				<ChartCard title={'Games played'} data={gamesplayed} data_int={gamesplayed_int} id={1} />
				<ChartCard title={'KDA'} data={kda} data_int={kda_int} id={2} />
				<ChartCard title={'Kills'} data={kills} data_int={kills_int} id={3} />
				<ChartCard title={'Deaths'} data={deaths} data_int={deaths_int} id={4} />
			</div>
		</div>
	)
}

export default Graphs
