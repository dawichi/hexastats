import React from 'react'
import ChartCard from '../components/ChartCard'

const Graphs = ({data}) => {

	// Trophies counter
	const trophies = {
		Alex: [],
		Bruno: [],
		Cristian: [],
		David: [],
		Marcos: [],
		Rodri: [],
		Samu: [],
		Diego: []
	}
	const player_names = []
	data.map(player => player_names.push(player.name))

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
	gamesplayed.map(player => {
		if (player.value == gamesplayed_int[0]) trophies[player.label].push(1)
		if (player.value == gamesplayed_int[1]) trophies[player.label].push(2)
		if (player.value == gamesplayed_int[2]) trophies[player.label].push(3)
	})

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
	winrates.map(player => {
		if (player.value == winrates_int[0]) trophies[player.label].push(1)
		if (player.value == winrates_int[1]) trophies[player.label].push(2)
		if (player.value == winrates_int[2]) trophies[player.label].push(3)
	})

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
	kda.map(player => {
		if (player.value == kda_int[0]) trophies[player.label].push(1)
		if (player.value == kda_int[1]) trophies[player.label].push(2)
		if (player.value == kda_int[2]) trophies[player.label].push(3)
	})

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
	kills.map(player => {
		if (player.value == kills_int[0]) trophies[player.label].push(1)
		if (player.value == kills_int[1]) trophies[player.label].push(2)
		if (player.value == kills_int[2]) trophies[player.label].push(3)
	})

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
	deaths.map(player => {
		if (player.value == deaths_int[0]) trophies[player.label].push(1)
		if (player.value == deaths_int[1]) trophies[player.label].push(2)
		if (player.value == deaths_int[2]) trophies[player.label].push(3)
	})

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
	assists.map(player => {
		if (player.value == assists_int[0]) trophies[player.label].push(1)
		if (player.value == assists_int[1]) trophies[player.label].push(2)
		if (player.value == assists_int[2]) trophies[player.label].push(3)
	})

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
	minions.map(player => {
		if (player.value == minions_int[0]) trophies[player.label].push(1)
		if (player.value == minions_int[1]) trophies[player.label].push(2)
		if (player.value == minions_int[2]) trophies[player.label].push(3)
	})

	const trophies_icon = (rank: number) => {
		const icons = {
			1: <span className="bg-yellow-400 p-1 rounded text-white mr-1"><i className="bi bi-trophy"></i></span>,
			2: <span className="bg-gray-700 p-1 rounded text-white mr-1"><i className="bi bi-trophy"></i></span>,
			3: <span className="bg-yellow-700 p-1 rounded text-white mr-1"><i className="bi bi-trophy"></i></span>
		}
		return icons[rank]
	}

	
	{player_names.map(player => trophies[player].sort(function(a, b) {return a - b}))}

	return (
		<div className="container">
			<div className="row p-3">
				{player_names.map((player, i) =>
					<div className="col-6 col-md-4 col-lg-3" key={i}>
						<div className="bg-gray-200 p-3 m-2">{player}: {trophies[player].map(x => trophies_icon(x))}</div>
					</div>
				)}
			</div>
			<hr/>
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