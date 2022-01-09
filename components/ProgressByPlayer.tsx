/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Chart, DataForChart } from '../interfaces/interfaces'
import { Player } from '../interfaces/player'
import { styles } from '../styles/styles.config'

// Progress bar with the stats of one player

// UNUSED
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
            player: player.alias,
            image: player.image,
        }

        prop_keys.map((prop: string) => {
            charts.map((x: Chart) => {
                if (x.key === prop) {
                    x.data.map((pair: DataForChart) => {
                        if (pair.label === player.alias) {
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
            games: main ? 'bg-green-500 dark:bg-green-500/75' : 'bg-green-100 dark:bg-green-900/25',
            winrate: main ? 'bg-blue-500 dark:bg-blue-500/75' : 'bg-blue-100 dark:bg-blue-900/25',
            kda: main ? 'bg-purple-500 dark:bg-purple-500/75' : 'bg-purple-100 dark:bg-purple-900/25',
            kills: main ? 'bg-red-500 dark:bg-red-500/75' : 'bg-red-100 dark:bg-red-900/25',
            deaths: main ? 'bg-gray-500 dark:bg-gray-500/75' : 'bg-gray-100 dark:bg-gray-900/25',
            assists: main ? 'bg-pink-500 dark:bg-pink-500/75' : 'bg-pink-100 dark:bg-pink-900/25',
            cs: main ? 'bg-yellow-500 dark:bg-yellow-500/75' : 'bg-yellow-100 dark:bg-yellow-900/25',
            csmin: main ? 'bg-yellow-500 dark:bg-yellow-500/75' : 'bg-yellow-100 dark:bg-yellow-900/25',
        }
        return props[prop]
    }

    return (
        <>
            {progress_by_player.map((model, idx_m) => {
                let total = 0

                {
                    prop_keys.map((prop: string) => {
                        if (prop !== 'deaths' && prop !== 'cs') {
                            total += (model[prop] * 100) / top_stats[prop]
                        }
                    })
                }

                return (
                    <div key={idx_m} className={`m-3 p-2 ${styles.foreground} ${styles.card}`}>
                        <div className='grid grid-cols-2'>
                            <div className='flex items-center'>
                                <img className='w-14 h-14 rounded' src={model.image} alt={model.player} />
                                <h3 className='text-2xl mx-4'>{model.player}</h3>
                            </div>
                            <div className='flex items-center justify-center'>
                                <span className={`rounded px-1 text-lg ${tintPercent(total / 6)}`}>{(total / 6).toFixed(1) + '%'}</span>
                            </div>
                        </div>

                        <hr style={{ width: '85%', margin: '10px' }} />

                        <div className='grid grid-cols-6 items-end text-sm text-center'>
                            {prop_keys.map((prop: string, idx_p: number) => {
                                if (prop !== 'deaths' && prop !== 'cs') {
                                    return (
                                        <div
                                            key={idx_p}
                                            className={
                                                'm-1 rounded text-white min-h-[150px] grid items-end ' + tintProgressBar(prop, false)
                                            }
                                        >
                                            <div
                                                className={'rounded ' + tintProgressBar(prop, true)}
                                                style={{ height: (model[prop] * 150) / top_stats[prop] + 'px' }}
                                            >
                                                {((model[prop] * 100) / top_stats[prop]).toFixed(0) + '%'}
                                            </div>
                                        </div>
                                    )
                                }
                            })}

                            {['Games', 'Winrate', 'KDA', 'Kills', 'Assists', 'CS/min'].map((stat, idx) => (
                                <p key={idx} className='text-center text-sm'>
                                    {stat}
                                </p>
                            ))}
                        </div>
                    </div>
                )
            })}
        </>
    )
}
