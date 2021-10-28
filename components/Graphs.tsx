import React from 'react'
import { Champs, Player } from '../interfaces/interfaces'
import trophyIcon from '../utils/trophyIcon'
import ChartCard from './ChartCard'

// ┌────────────────┐
// │  GRAPHS PAGE:  │
// └────────────────┘
// Process the data with 'process()' function to get the specific
// stats of each category and pass the filtered information to the <PieChart/> components
const Graphs = ({data}) => {

	// We'll use the names to show its trophies
	const player_names = []
	data.map((player: Player) => player_names.push(player.name))

	// Trophies counter for each player
	// TODO: get the player names from [player_names]
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

	const process = (prop: string, float?:boolean, calc_median?: boolean, sort_desc?: boolean) => {
		/* - prop: the type of property to load. Ex: 'games', 'winrate' or 'kills'
		*  - float?: by default uses parseInt() for data. Optional parseFloat()
		*  - calc_media?: by default returns total data. Optional returns median.
		*  - sort_desc?: by default returns asc sort. Optional desc sort (when less points is better). 
		*/
		const player_infos = [] // [{label: 'name', value: 5}]
		const player_values = [] // [5]
		data.map((player: Player) => {
			// Fills both arrays with data
			let total = 0
			player.champs.map((x: Champs) => total += float ? parseFloat(x[prop]) : parseInt(x[prop]))
			player_infos.push({label: player.name, value: calc_median ? (total/7).toFixed(2) : total})
			player_values.push(calc_median ? (total/7).toFixed(2) : total)
		})
		player_values.sort(function(a, b) {
			if (sort_desc) return a - b
			else return b - a
		})
		// If the best value matches with a player's value, adds 1º cup (value '1') to his trophies array. Same for 2º and 3º rank.
		player_infos.map(player_info => {
			if (player_info.value == player_values[0]) trophies[player_info.label].push(1)
			if (player_info.value == player_values[1]) trophies[player_info.label].push(2)
			if (player_info.value == player_values[2]) trophies[player_info.label].push(3)
		})
		// returns the data built to use it in <PieChart/> components
		// the player values is returned too, to allow show cups in the charts also
		return [player_infos, player_values]
	}

	// We get our different data throw or process() function
	const [gamesplayed, gamesplayed_int] = process('games', false, false, false)
	const [winrates, winrates_int] = process('winrate', true, true, false)
	const [kda, kda_int] = process('kda', true, true, false)
	const [kills, kills_int] = process('kills', true, true, false)
	const [deaths, deaths_int] = process('deaths', true, true, true)
	const [assists, assists_int] = process('assists', true, true, false)
	const [minions, minions_int] = process('cs', true, true, false)

	// Sorts player's trophies by value (so it shows 1º, 2º and 3º cups in correct order)
	{player_names.map(player => trophies[player].sort(function(a, b) {return a - b}))}

	return (
		<div className="container">
			<div className="row p-3">
				{player_names.map((player, i) =>
					<div className="col-6 col-md-4 col-lg-3" key={i}>
						<div className="bg-gray-200 p-3 m-2">{player}: {trophies[player].map(x => trophyIcon(x))}</div>
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