import React from 'react'
import getPlayerStats from '../utils/getPlayerStats'
import { Champs, Player, PlayerStats } from '../interfaces/interfaces'
import PieChart from './PieChart'

interface data_by_player {
	name: string,
	data: PlayerStats[]
}

export default function DataByPlayer({data}) {

	const data_by_player: data_by_player[] = []

	const prop_keys = ['games','winrate','kda','kills','deaths','assists','cs','csmin']
	data.forEach((player: Player, index_player: number) => {
		data_by_player.push(getPlayerStats(player, prop_keys))
	})

	return (
		<div className="container mx-auto">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
				{ data_by_player && data_by_player.map((player, index_player) => (
					<div key={index_player} className="border shadow-lg rounded m-3">
						<h3 className="text-2xl text-center mx-3 mt-3">{player.name}</h3>
						<PieChart data={player.data} outerRadius={120} innerRadius={50} id={10 + index_player} />
					</div>
				))}
			</div>
		</div>

	)
}
