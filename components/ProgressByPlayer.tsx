/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Player } from '../interfaces/interfaces'
import statTitle from '../utils/statTitle'

// Progress bar with the stats of one player
export default function ProgressOfEachPlayer({data, charts, prop_keys}) {

	const top_stats = {}
	charts.map(x => top_stats[x.key] = x.data_int[0])

	// TODO: end this shit

	const progress_by_player = []
	data.map((player: Player) => {
		
		const model = {
			player: player.name,
			image: player.image
		}

		prop_keys.map(prop => {
			charts.map(x => {
				if (x.key === prop) {
					x.data.map(pair => {
						if (pair.label === player.name) {
							model[prop] = pair.value
						}
					})
				}
			})
		})
		progress_by_player.push(model)
	})

	const tintProgressBar = (prop: string, main: boolean) => {
		const props = {
			games: main ? 'bg-green-500' : 'bg-green-100',
			winrate: main ? 'bg-blue-500' : 'bg-blue-100',
			kda: main ? 'bg-purple-500' : 'bg-purple-100',
			kills: main ? 'bg-red-500' : 'bg-red-100',
			deaths: main ? 'bg-gray-500' : 'bg-gray-100',
			assists: main ? 'bg-pink-500' : 'bg-pink-100',
			cs: main ? 'bg-yellow-500' : 'bg-yellow-100',
			csmin: main ? 'bg-yellow-500' : 'bg-yellow-100',
		}
		return props[prop]
	}

	const tintPercent = (percent: number) => {
		if (percent < 50) return 'bg-red-300'
		if (percent < 60) return 'bg-gray-300'
		if (percent < 70) return 'bg-indigo-300'
		if (percent < 80) return 'bg-blue-300'
		if (percent > 80) return 'bg-green-300'
	}

	return (
		<>
			{ progress_by_player.map((model, index_model) => {
				let total = 0
				{prop_keys.map((prop: string) => {
					if (prop !== 'deaths' && prop !== 'cs') {
						total += ((model[prop]*100)/top_stats[prop])
					}
				})}
				return (
					<div key={index_model} className="border shadow-lg rounded-lg m-3 p-4 bg-gray-100 hover:shadow-xl">
						<div className="flex items-center">
							<img className="w-14 h-14 rounded" src={model.image} alt={model.player} />
							<h3 className="text-2xl mx-4">{model.player}</h3>
							<span className={`rounded px-1 text-lg ${tintPercent(total/6)}`}>{(total/6).toFixed(1) + '%'}</span>
						</div>
						<hr style={{width: '85%', margin: '10px'}} />
							<div className="grid grid-cols-2">
								{ prop_keys.map((prop, index_prop) => {
									if (prop === 'deaths' || prop === 'cs') {
										return
									}
									return (
										<div key={index_prop} className="p-1">
											<p>{statTitle(prop)}</p>
											<div className={'rounded text-white text-sm text-center ' + tintProgressBar(prop, false)}>
												<div
													className={'rounded ' + tintProgressBar(prop, true)}
													style={{width: ((model[prop]*100)/top_stats[prop]) + '%'}}
												>{((model[prop]*100)/top_stats[prop]).toFixed(0) + '%'}</div>
											</div>
										</div>
									)
								})}
							</div>
					</div>
				)
			})
			}
		</>
	)
}