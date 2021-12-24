/* eslint-disable @next/next/no-img-element */
import React from 'react'
import axios from 'axios'
import { Player } from '../interfaces/interfaces'
import { styles } from '../styles/styles.config'
import { backend, players } from '../config'

// ┌────────────────┐
// │ RANKING PAGE:  │
// └────────────────┘
//
export default function Ranking(props: { data: any[] }) {
    // Model of player data to sort
    const rank_data = []
    props.data.map((player: Player) => {
        if (player.rank.rank_n) {
            rank_data.push({
                name: player.name,
                image: player.image,
                rank_n: player.rank.rank_n,
                rank_p: player.rank.rank_p,
            })
        }
    })

    rank_data.sort(function (a, b) {
        return a.rank_p - b.rank_p
    })

    const tint = (percent: number, main: boolean) => {
        if (percent > 90) return main ? 'from-indigo-800 to-indigo-500' : 'bg-indigo-300/50 dark:bg-indigo-700/25'
        if (percent > 80) return main ? 'from-blue-800 to-blue-500' : 'bg-blue-300/50 dark:bg-blue-700/25'
        if (percent > 65) return main ? 'from-green-800 to-green-500' : 'bg-green-300/50 dark:bg-green-700/25'
        if (percent > 50) return main ? 'from-yellow-800 to-yellow-500' : 'bg-yellow-300/50 dark:bg-yellow-700/25'
        if (percent > 35) return main ? 'from-gray-800 to-gray-500' : 'bg-gray-300/50 dark:bg-gray-700/25'
        if (percent < 35) return main ? 'from-red-800 to-red-500' : 'bg-red-300/50 dark:bg-red-700/25'
    }

    const tints = [
        { color: 'bg-indigo-500 dark:bg-indigo-600/75', top: 'Top 10🔥 % ' },
        { color: 'bg-blue-500 dark:bg-blue-600/75', top: 'Top 20 %' },
        { color: 'bg-green-500 dark:bg-green-600/75', top: 'Top 35 %' },
        { color: 'bg-yellow-500 dark:bg-yellow-600/75', top: 'Top 50 %' },
        { color: 'bg-gray-500 dark:bg-gray-600/75', top: 'Below 50 %' },
        { color: 'bg-red-500 dark:bg-red-600/75', top: 'Below 35 %' },
    ]

    return (
        <>
            <div className='container-fluid min-h-screen'>
                <div className='flex justify-center pt-4 text-white'>
                    {tints.map((tint, index) => (
                        <span key={index} className={`mx-1 px-3 py-1 rounded ${tint.color}`}>
                            {tint.top}
                        </span>
                    ))}
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'>
                    {rank_data.map((player, index: number) => {
                        return (
                            <div key={index} className={`m-3 p-3 ${styles.foreground} ${styles.card}`}>
                                <div className='flex'>
                                    <img className='m-2 w-14 h-14 rounded' src={player.image} alt={player.name} />
                                    <div className='flex flex-col'>
                                        <span className='pb-1 text-xl'>
                                            {index + 1}. {player.name}
                                        </span>
                                        <span className='pb-1'>{player.rank_n ? player.rank_n + 'º' : 'no data ;('}</span>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Better than the</span>
                                    <span>of all players</span>
                                </div>
                                <div className={`rounded-xl text-white text-sm text-center ${tint(100 - player.rank_p, false)}`}>
                                    <div
                                        className={`rounded-xl bg-gradient-to-r ${tint(100 - player.rank_p, true)}`}
                                        style={{ width: 100 - player.rank_p + '%' }}
                                    >
                                        {(100 - player.rank_p).toFixed(1)} %
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

// Fetch data from euw.op.gg with getStaticProps()'s NextJS function
export const getStaticProps = async () => {
    const data: Player[] = []
    for (let idx = 0; idx < players.length; idx++) {
        let player_response = await axios.get(backend + players[idx])
        data.push(player_response.data)
    }

    return {
        props: { data: data },
    }
}
