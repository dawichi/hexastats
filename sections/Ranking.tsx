/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Player } from '../interfaces/interfaces'

export default function Ranking({data}) {

	// Model of player data to sort
	const rank_data = []
	data.map((player: Player) => {
		rank_data.push({
			name: player.name,
			image: player.image,
			rank_n: player.rank_n,
			rank_p: player.rank_p
		})
	})

	rank_data.sort(function(a, b) {return a.rank_p - b.rank_p})

	return (
		<div className="container-fluid">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
				{
					rank_data.map((player: Player, index: number) => {
						return (
							<div key={index} className="m-3 p-3 border shadow rounded">
								<div className="flex">
									<img className="m-2 w-14 h-14 rounded" src={player.image} alt={player.name} />
									<div className="flex flex-col">
										<span className="pb-1 text-xl">{player.name}</span>
										<span className="pb-1l">{player.rank_n ? player.rank_n + 'º' : 'no data ;('}</span>
									</div>
								</div>
								<div className="rounded bg-red-300 w-100 text-red-300">
									<div className="rounded text-center bg-red-600 text-white" style={{width: (100 - player.rank_p) + '%'}}>{(100 - player.rank_p).toFixed(1)} %</div>
								</div>
							</div>
						)
					})
				}
			</div>
		</div>
	)
}