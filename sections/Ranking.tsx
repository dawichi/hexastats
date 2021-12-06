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
	
	const tint = (percent: number) => {
		if (percent > 90) return 'indigo'
		if (percent > 80) return 'blue'
		if (percent > 65) return 'green'
		if (percent > 50) return 'yellow'
		if (percent > 35) return 'gray'
		if (percent < 35) return 'red'
	}

	const tints = [
		{color: 'indigo', top: 'Top 10🔥 % '},
		{color: 'blue', top: 'Top 20 %'},
		{color: 'green', top: 'Top 35 %'},
		{color: 'yellow', top: 'Top 50 %'},
		{color: 'gray', top: 'Below 50 %'},
		{color: 'red', top: 'Below 35 %'},
	]

	return (
		<>
			<div className="container-fluid">
				<div className="flex justify-center pt-4">
					{tints.map((tint, index) => <span key={index} className={`mx-1 px-3 py-1 rounded bg-${tint.color}-400`}>{tint.top}</span>)}
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
					{
						rank_data.map((player: Player, index: number) => {
							if (!player.rank_n) return
							return (
								<div key={index} className="m-3 p-3 border shadow rounded-lg bg-gray-100 hover:shadow-xl">
									<div className="flex">
										<img className="m-2 w-14 h-14 rounded" src={player.image} alt={player.name} />
										<div className="flex flex-col">
											<span className="pb-1 text-xl">{index + 1}. {player.name}</span>
											<span className="pb-1">{player.rank_n ? player.rank_n + 'º' : 'no data ;('}</span>
										</div>
									</div>
									<div className="flex justify-between">
										<span>Better than the</span>
										<span>of average players</span>
									</div>
									<div className={`rounded-xl text-white text-sm text-center bg-${tint(100 - player.rank_p)}-200`}>
										<div className={`rounded-xl bg-${tint(100 - player.rank_p)}-600`} style={{width: (100 - player.rank_p) + '%'}}>{(100 - player.rank_p).toFixed(1)} %</div>
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
		</>
	)
}