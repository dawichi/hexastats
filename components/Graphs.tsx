import React from 'react'
import ChartCard from './ChartCard'

//─
//
//
//
//
const Graphs = ({data}) => {

	// Trophies counter for each player
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


	const process = (prop: string, float?:boolean, calc_media?: boolean, order_desc?: boolean) => {
		const array = []
		const array_int = []
		data.map(player => {
			let total = 0
			player.champs.map(x => total += float ? parseFloat(x[prop]) : parseInt(x[prop]))
			array.push({label: player.name, value: calc_media ? (total/7).toFixed(2) : total})
			array_int.push(calc_media ? (total/7).toFixed(2) : total)
		})
		array_int.sort(function(a, b) {
			if (order_desc) return a - b
			else return b - a
		})
		array.map(player => {
			if (player.value == array_int[0]) trophies[player.label].push(1)
			if (player.value == array_int[1]) trophies[player.label].push(2)
			if (player.value == array_int[2]) trophies[player.label].push(3)
		})
		return [array, array_int]
	}

	const [gamesplayed, gamesplayed_int] = process('games', false, false, false)
	const [winrates, winrates_int] = process('winrate', true, true, false)
	const [kda, kda_int] = process('kda', true, true, false)
	const [kills, kills_int] = process('kills', true, true, false)
	const [deaths, deaths_int] = process('deaths', true, true, true)
	const [assists, assists_int] = process('assists', true, true, false)
	const [minions, minions_int] = process('cs', true, true, false)

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