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

	// WINRATE
	const winrates = []
	const winrates_int = []
	data.map(player => {
		let winrate = 0
		player.champs.map(x => winrate += parseInt(x.winrate))
		winrates.push({label: player.name, value: (winrate/7).toFixed(2)})
		winrates_int.push((winrate/7).toFixed(2))
	})
	winrates_int.sort(function(a, b) {return b - a})

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
		kills.push({label: player.name, value: (total_kills/7).toFixed(2)})
		kills_int.push((total_kills/7).toFixed(2))
	})
	kills_int.sort(function(a, b) {return b - a})

	// DEATHS
	const deaths = []
	const deaths_int = []
	data.map(player => {
		let total_deaths = 0
		player.champs.map(x => total_deaths += parseFloat(x.deaths))
		deaths.push({label: player.name, value: (total_deaths/7).toFixed(2)})
		deaths_int.push((total_deaths/7).toFixed(2))
	})
	deaths_int.sort(function(a, b) {return a - b})

	// ASSISTS
	const assists = []
	const assists_int = []
	data.map(player => {
		let total_assists = 0
		player.champs.map(x => total_assists += parseFloat(x.assists))
		assists.push({label: player.name, value: (total_assists/7).toFixed(2)})
		assists_int.push((total_assists/7).toFixed(2))
	})
	assists_int.sort(function(a, b) {return b - a})

	// MINIONS
	const minions = []
	const minions_int = []
	data.map(player => {
		let total_minions = 0
		player.champs.map(x => total_minions += parseFloat(x.cs))
		minions.push({label: player.name, value: (total_minions/7).toFixed(2)})
		minions_int.push((total_minions/7).toFixed(2))
	})
	minions_int.sort(function(a, b) {return b - a})

	return (
		<div className="container">
			<div className="row">
				<ChartCard title={'Games played'} data={gamesplayed} data_int={gamesplayed_int} id={1} />
				<ChartCard title={'Winrate'} data={winrates} data_int={winrates_int} id={2} />
				<ChartCard title={'KDA'} data={kda} data_int={kda_int} id={3} />
				<ChartCard title={'Kills'} data={kills} data_int={kills_int} id={4} />
				<ChartCard title={'Deaths'} data={deaths} data_int={deaths_int} id={5} />
				<ChartCard title={'Assists'} data={assists} data_int={assists_int} id={6} />
				<ChartCard title={'Minions'} data={minions} data_int={minions_int} id={7} />
			</div>
		</div>
	)
}

export default Graphs
