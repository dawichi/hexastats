/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Player } from '../interfaces/interfaces'
import propTitle from '../utils/propTitle'

export default function ProgressOfEachPlayer({data, charts, prop_keys, rank_results}) {

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

	const tintProgressBar = (prop: string) => {
		const props = {
			games: 'bg-green-',
			winrate: 'bg-blue-',
			kda: 'bg-purple-',
			kills: 'bg-red-',
			deaths: 'bg-gray-',
			assists: 'bg-pink-',
			cs: 'bg-yellow-',
			csmin: 'bg-yellow-',
		}
		return props[prop]
	}

	const tintPercent = (percent: number) => {
		if (percent < 50) return 'red'
		if (percent < 60) return 'gray'
		if (percent < 70) return 'indigo'
		if (percent < 80) return 'blue'
		if (percent > 80) return 'green'
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
							<span className={`rounded px-1 text-lg bg-${tintPercent(total/6)}-300`}>{(total/6).toFixed(1) + '%'}</span>
						</div>
						<hr style={{width: '85%', margin: '10px'}} />
							<div className="grid grid-cols-2">
								{ prop_keys.map((prop, index_prop) => {
									if (prop === 'deaths' || prop === 'cs') {
										return
									}
									return (
										<div key={index_prop} className="p-1">
											<p>{propTitle(prop)}</p>
											<div className={'rounded text-red-200 ' + tintProgressBar(prop) + '100'}>
												<div
													className={'rounded text-white text-sm text-center ' + tintProgressBar(prop) + '500' }
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