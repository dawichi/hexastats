import React from 'react'
import ChartCard from './ChartCard'

const Graphs = ({data}) => {

	const gamesplayed = []
	const gamesplayed_int = []
	data.map(player => {
		let total_games = 0
		player.champs.map(x => total_games += parseInt(x.games))
		gamesplayed.push({label: player.name, value: total_games})
		gamesplayed_int.push(total_games)
	})
	gamesplayed_int.sort(function(a, b) {return b - a})


	const kda = []
	const kda_int = []
	data.map(player => {
		let total_kda = 0
		player.champs.map(x => total_kda += parseFloat(x.kda))
		kda.push({label: player.name, value: (total_kda/7).toFixed(2)})
		kda_int.push((total_kda/7).toFixed(2))
	})
	kda_int.sort(function(a, b) {return b - a})

	return (
		<div className="container">
			<div className="row">
				<ChartCard title={'Games played'} data={gamesplayed} data_int={gamesplayed_int} id={1} />
				<ChartCard title={'KDA'} data={kda} data_int={kda_int} id={2} />
			</div>
		</div>
	)
}

export default Graphs
