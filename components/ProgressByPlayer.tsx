/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Chart, DataForChart, Player } from '../interfaces/interfaces'
import { styles } from '../styles/styles.config'
import { statTitle } from '../utils'

// Progress bar with the stats of one player
export default function ProgressOfEachPlayer({ data, charts, prop_keys }) {
    // Fills the top stasts for each stat as [key] and each max value as [value]
    const top_stats = {
        /*  'kills': 12.5,  */
    }
    charts.map((x: Chart) => (top_stats[x.key] = x.data_int[0]))

    // TODO: end document this

    const progress_by_player = []
    data.map((player: Player) => {
        const model = {
            player: player.name,
            image: player.image,
        }

        prop_keys.map((prop: string) => {
            charts.map((x: Chart) => {
                if (x.key === prop) {
                    x.data.map((pair: DataForChart) => {
                        if (pair.label === player.name) {
                            model[prop] = pair.value
                        }
                    })
                }
            })
        })
        progress_by_player.push(model)
    })

    const tintPercent = (percent: number) => {
        if (percent < 50) return 'bg-red-300 dark:bg-red-500'
        if (percent < 60) return 'bg-gray-300 dark:bg-gray-500'
        if (percent < 70) return 'bg-indigo-300 dark:bg-indigo-500'
        if (percent < 80) return 'bg-blue-300 dark:bg-blue-500'
        if (percent > 80) return 'bg-green-300 dark:bg-green-500'
    }

    const tintProgressBar = (prop: string, main: boolean) => {
        const props = {
            games: main ? 'bg-green-500 dark:bg-green-800' : 'bg-green-100 dark:bg-green-300',
            winrate: main ? 'bg-blue-500 dark:bg-blue-800' : 'bg-blue-100 dark:bg-blue-300',
            kda: main ? 'bg-purple-500 dark:bg-purple-800' : 'bg-purple-100 dark:bg-purple-300',
            kills: main ? 'bg-red-500 dark:bg-red-800' : 'bg-red-100 dark:bg-red-300',
            deaths: main ? 'bg-gray-500 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-300',
            assists: main ? 'bg-pink-500 dark:bg-pink-800' : 'bg-pink-100 dark:bg-pink-300',
            cs: main ? 'bg-yellow-500 dark:bg-yellow-800' : 'bg-yellow-100 dark:bg-yellow-300',
            csmin: main ? 'bg-yellow-500 dark:bg-yellow-700' : 'bg-yellow-100 dark:bg-yellow-300',
        }
        return props[prop]
    }

    return (
        <>
            {progress_by_player.map((model, index_model) => {
                let total = 0
                {
                    prop_keys.map((prop: string) => {
                        if (prop !== 'deaths' && prop !== 'cs') {
                            total += (model[prop] * 100) / top_stats[prop]
                        }
                    })
                }
                return (
                    <div key={index_model} className={`m-3 p-4 ${styles.foreground} ${styles.card}`}>
                        <div className='flex items-center'>
                            <img className='w-14 h-14 rounded' src={model.image} alt={model.player} />
                            <h3 className='text-2xl mx-4'>{model.player}</h3>
                            <span className={`rounded px-1 text-lg ${tintPercent(total / 6)}`}>
                                {(total / 6).toFixed(1) + '%'}
                            </span>
                        </div>
                        <hr style={{ width: '85%', margin: '10px' }} />
                        <div className='grid grid-cols-2'>
                            {prop_keys.map((prop, index_prop) => {
                                if (prop === 'deaths' || prop === 'cs') {
                                    return
                                }
                                return (
                                    <div key={index_prop} className='p-1'>
                                        <p>{statTitle(prop)}</p>
                                        <div
                                            className={
                                                'rounded text-white text-sm text-center ' + tintProgressBar(prop, false)
                                            }
                                        >
                                            <div
                                                className={'rounded ' + tintProgressBar(prop, true)}
                                                style={{ width: (model[prop] * 100) / top_stats[prop] + '%' }}
                                            >
                                                {((model[prop] * 100) / top_stats[prop]).toFixed(0) + '%'}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </>
    )
}
