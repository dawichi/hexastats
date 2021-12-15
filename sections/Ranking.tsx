/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Player } from '../interfaces/interfaces'
import { styles } from '../styles/styles.config'

// ┌────────────────┐
// │ RANKING PAGE:  │
// └────────────────┘
// 
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
	
	const tint = (percent: number, main: boolean) => {
		if (percent > 90) return main ? 'bg-indigo-600' : 'bg-indigo-200'
		if (percent > 80) return main ? 'bg-blue-600' : 'bg-blue-200'
		if (percent > 65) return main ? 'bg-green-600' : 'bg-green-200'
		if (percent > 50) return main ? 'bg-yellow-600' : 'bg-yellow-200'
		if (percent > 35) return main ? 'bg-gray-600' : 'bg-gray-200'
		if (percent < 35) return main ? 'bg-red-600' : 'bg-red-200'
	}

	const tints = [
		{color: 'bg-indigo-400 dark:bg-indigo-500', top: 'Top 10🔥 % '},
		{color: 'bg-blue-400 dark:bg-blue-500', top: 'Top 20 %'},
		{color: 'bg-green-400 dark:bg-green-500', top: 'Top 35 %'},
		{color: 'bg-yellow-400 dark:bg-yellow-500', top: 'Top 50 %'},
		{color: 'bg-gray-400 dark:bg-gray-500', top: 'Below 50 %'},
		{color: 'bg-red-400 dark:bg-red-500', top: 'Below 35 %'},
	]

	return (
		<>
			<div className="container-fluid min-h-screen">
				<div className="flex justify-center pt-4">
					{tints.map((tint, index) => <span key={index} className={`mx-1 px-3 py-1 rounded ${tint.color}`}>{tint.top}</span>)}
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
					{
						rank_data.map((player: Player, index: number) => {
							if (!player.rank_n) return
							return (
								<div key={index} className={`m-3 p-3 ${styles.foreground} ${styles.card}`}>
									<div className="flex">
										<img className="m-2 w-14 h-14 rounded" src={player.image} alt={player.name} />
										<div className="flex flex-col">
											<span className="pb-1 text-xl">{index + 1}. {player.name}</span>
											<span className="pb-1">{player.rank_n ? player.rank_n + 'º' : 'no data ;('}</span>
										</div>
									</div>
									<div className="flex justify-between">
										<span>Better than the</span>
										<span>of all players</span>
									</div>
									<div className={`rounded-xl text-white text-sm text-center ${tint(100 - player.rank_p, false)}`}>
										<div className={`rounded-xl ${tint(100 - player.rank_p, true)}`} style={{width: (100 - player.rank_p) + '%'}}>{(100 - player.rank_p).toFixed(1)} %</div>
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