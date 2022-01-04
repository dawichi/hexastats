import React, { useState } from 'react'
import axios from 'axios'
import { backend, players } from '../configs'
import { statTitle, getStats } from '../utils'
import { RankStructure } from '../components'
import { PlayerStatsResult } from '../interfaces/interfaces'
import { Player } from '../interfaces/player'
import { styles } from '../styles/styles.config'

// ┌────────────────┐
// │ Compare PAGE:  │
// └────────────────┘
// Allows to select 2 players and compares its stats
export default function Compare(props: { data: Player[] }) {
    // Players selected for compare
    const [left, setLeft] = useState(0)
    const [right, setRight] = useState(0)

    // logic when a player card is selected
    // TODO: try pop-over
    const handleSelect = (idx: number) => {
        if (idx + 1 === left) {
            setLeft(0)
        } else if (idx + 1 === right) {
            setRight(0)
        } else {
            if (!left) setLeft(idx + 1)
            else if (!right) setRight(idx + 1)
            else if (idx + 1 != left && idx + 1 != right) setRight(idx + 1)
        }
    }

    // styles
    const tintPlayerSelected = (idx: number) => {
        if (idx + 1 === left) return 'bg-blue-400'
        else if (idx + 1 === right) return 'bg-red-400' // right
        return 'bg-zinc-100 dark:bg-zinc-800' // unselected
    }

    // Sort players by ELO
	props.data.forEach(player => player.rank.rank_p = player.rank.rank_p ? player.rank.rank_p : 100)
    props.data.sort((a, b) => a.rank.rank_p - b.rank.rank_p)

    const playerStructure = (player: Player) => (
        <div className='flex items-center justify-center gap-4'>
            <div className='relative flex flex-col items-center text-sm text-white'>
                <img className='m-3 w-14 rounded' src={player.image} alt={player.name} />
                <span className='px-1 absolute bottom-0 bg-zinc-700 border border-yellow-500 rounded-full'>{player.level}</span>
            </div>
            <div className='flex flex-col'>
                <h2 className='text-xl'>
                    {player.name}
                    {}
                </h2>
                <h3>({player.alias})</h3>
            </div>
            <RankStructure title={'Solo/Duo'} rankdata={player.rank.solo} />
            <RankStructure title={'Flex'} rankdata={player.rank.flex} />
        </div>
    )

    // TODO: get dinamically this
    const stats: string[] = [
        'games',
        'winrate',
        'kda',
        'kills',
        'deaths',
        'assists',
        'cs',
        'csmin',
        'gold',
        'max_kills',
        'max_deaths',
        'avg_damage_dealt',
        'avg_damage_taken',
        'double_kills',
        'triple_kills',
        'quadra_kills',
        'penta_kills',
    ]

    const progressBar = (l_value: number, r_value: number, title: string, activated: boolean) => {
        const calcWidth = (x: number, y: number) => (100 * x) / (x + y)
		const reformat = (value: number) => value/1000 < 1 ? value : (value/1000).toFixed(2) + ' k'

        return (
            <div className='flex justify-end items-end m-1'>
                {/* TODO: some stat titles missing */}
                <span className='mx-2'>{statTitle(title)}</span>
                <div className='w-96'>
                    <div className='relative h-px text-center text-white'>
                        <div className='absolute left-2 top-0 text-sm'>{reformat(l_value)}</div>
						<div className='absolute translate-x-20 top-0 text-sm'> {calcWidth(l_value, r_value).toFixed(2)} %</div>
                        <div className='-translate-y-2 text-2xl'>|</div>
						<div className='-translate-y-8 translate-x-20 top-0 text-sm'> {(100 - calcWidth(l_value, r_value)).toFixed(2)} %</div>
                        <div className='absolute right-2 top-0 text-sm'>{reformat(r_value)}</div>
                    </div>
                    {activated ? (
                        <div className='bg-red-400 dark:bg-red-400/75 rounded h-5'>
                            <div
                                className='bg-blue-500 dark:bg-blue-500/75 rounded-tl rounded-bl h-5'
                                style={{ width: `${calcWidth(l_value, r_value)}%` }}
                            ></div>
                        </div>
                    ) : (
                        <div className='bg-zinc-400 dark:bg-zinc-600 rounded h-5'></div>
                    )}
                </div>
            </div>
        )
    }

    // TODO: Add how much blue and red surface are covered and show it as a percent at the end of the column
    const comparePlayers = (leftPlayer: PlayerStatsResult, rightPlayer: PlayerStatsResult) => (
        <div className='container flex flex-col justify-center items-center mx-auto'>
            <div>
                {stats.map((stat, idx) => (
                    <div key={idx}>{progressBar(leftPlayer[stat], rightPlayer[stat], stat, leftPlayer[stat] || rightPlayer[stat])}</div>
                ))}
            </div>
        </div>
    )

    return (
        <div className='animate__animated animate__fadeIn'>
            <div className='flex justify-center pt-4 text-white'>
                {tints.map((tint, index) => (
                    <span key={index} className={`mx-1 px-3 py-1 rounded ${tint.color}`}>
                        {tint.top}
                    </span>
                ))}
            </div>
            <div className='container mx-auto p-4'>
                <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                    {props.data.map((player, idx) => (
                        <div
                            key={idx}
                            className={`p-2 cursor-pointer ${styles.card} ${tintPlayerSelected(idx)}`}
                            onClick={() => handleSelect(idx)}
                        >
                            <div className='flex items-center justify-around'>
                                <div className='relative flex flex-col items-center text-sm text-white'>
                                    <img className='m-3 w-14 rounded' src={player.image} alt={player.name} />
                                    <span className='px-1 absolute bottom-0 bg-zinc-700 border border-yellow-500 rounded-full'>
                                        {player.level}
                                    </span>
                                </div>
                                <div className='flex flex-col'>
                                    <h2 className='text-xl'>
                                        {idx + 1}. {player.name}
                                    </h2>
                                    <h3>({player.alias})</h3>
                                </div>
                            </div>
                            <div className='mt-2 flex justify-between'>
                                <span>{player.rank.rank_n.toLocaleString('es-ES')}º</span>
                                <span>{player.rank.rank_p.toFixed(1)} %</span>
                            </div>
                            <div className={`rounded-xl h-2 ${tint(100 - player.rank.rank_p, false)}`}>
                                <div
                                    className={`rounded-xl h-2 bg-gradient-to-r ${tint(100 - player.rank.rank_p, true)}`}
                                    style={{ width: 100 - player.rank.rank_p + '%' }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <h2 className='text-center text-2xl m-4'>Compare players</h2>
            <hr className='w-4/5 mx-auto' />

            <div className='container mx-auto p-4 grid gap-4 md:grid-cols-2'>
                {/* If at least 1 player selected ==> show 'clear' button */}
                {left != 0 || right != 0 ? (
                    <div className='md:col-span-2'>
                        <button
                            className='bg-red-500 rounded text-white shadow py-2 px-3 mx-auto'
                            onClick={() => {
                                setLeft(0)
                                setRight(0)
                            }}
                        >
                            <i className='bi bi-x-lg'></i> Clear selection
                        </button>
                    </div>
                ) : (
                    ''
                )}
                <div className='bg-blue-400/25 rounded shadow'>{left != 0 && playerStructure(props.data[left - 1])}</div>
                <div className='bg-red-400/25 rounded shadow'>{right != 0 && playerStructure(props.data[right - 1])}</div>
            </div>

            {/* If no players selected in any side ==> alert message explaining */}
            {left === 0 && right === 0 && (
                <div className='w-96 mx-auto'>
                    <div className='bg-sky-100 bg-sky-400/50 border-l-4 border-sky-500 text-sky-800 dark:text-white p-4'>
                        <p className='font-bold'>No players selected</p>
                        <p>Select 2 players above to start comparing stats!</p>
                    </div>
                </div>
            )}

            {/* If 2 players selected ==> compare them! */}
            {left != 0 && right != 0 && comparePlayers(getStats(props.data[left - 1]), getStats(props.data[right - 1]))}
        </div>
    )
}

// TODO: this 2 functions, sould be merged in 1 big object
const tints = [
    { color: 'bg-indigo-500 dark:bg-indigo-600/75', top: 'Top 10🔥 % ' },
    { color: 'bg-blue-500 dark:bg-blue-600/75', top: 'Top 20 %' },
    { color: 'bg-green-500 dark:bg-green-600/75', top: 'Top 35 %' },
    { color: 'bg-yellow-500 dark:bg-yellow-600/75', top: 'Top 50 %' },
    { color: 'bg-gray-500 dark:bg-gray-600/75', top: 'Below 50 %' },
    { color: 'bg-red-500 dark:bg-red-600/75', top: 'Below 35 %' },
]

const tint = (percent: number, main: boolean) => {
    if (percent > 90) return main ? 'from-indigo-800 to-indigo-500' : 'bg-indigo-300/50 dark:bg-indigo-700/25'
    if (percent > 80) return main ? 'from-blue-800 to-blue-500' : 'bg-blue-300/50 dark:bg-blue-700/25'
    if (percent > 65) return main ? 'from-green-800 to-green-500' : 'bg-green-300/50 dark:bg-green-700/25'
    if (percent > 50) return main ? 'from-yellow-800 to-yellow-500' : 'bg-yellow-300/50 dark:bg-yellow-700/25'
    if (percent > 35) return main ? 'from-gray-800 to-gray-500' : 'bg-gray-300/50 dark:bg-gray-700/25'
    if (percent < 35) return main ? 'from-red-800 to-red-500' : 'bg-red-300/50 dark:bg-red-700/25'
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
