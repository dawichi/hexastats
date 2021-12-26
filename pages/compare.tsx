import React, { useState } from 'react'
import axios from 'axios'
import { backend, players } from '../config'
import { statTitle, Rank, getStats } from '../utils'
import { Player, PlayerStatsResult } from '../interfaces/interfaces'
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
    const handleSelect = (idx: number) => {
        if (!left) setLeft(idx + 1)
        else if (!right) setRight(idx + 1)
        else {
            if (idx + 1 === left) setLeft(0)
            if (idx + 1 === right) setRight(0)
        }
    }

    // styles
    const playerSelected = (idx: number) => {
        if (idx + 1 === left) return 'bg-blue-400' // left
        else if (idx + 1 === right) return 'bg-red-400' // right
        return 'bg-zinc-100 dark:bg-zinc-800' // unselected
    }

    const rankStructure = (player: Player) => (
        <div className='flex items-center justify-center'>
            <div className='relative flex flex-col items-center text-sm text-white'>
                <img className='m-3 w-14 rounded' src={player.image} alt={player.name} />
                <span className='px-1 absolute bottom-0 bg-zinc-700 border border-yellow-500 rounded-full'>{player.level}</span>
            </div>
            <div className='flex flex-col'>
                <h2 className='text-xl'>{player.name}</h2>
                <h3>({player.alias})</h3>
            </div>
            <div className='m-2'>
                <Rank
                    title={'Solo/Duo'}
                    rank={player.rank.solo.rank}
                    image={player.rank.solo.image}
                    lp={player.rank.solo.lp}
                    win={player.rank.solo.win}
                    lose={player.rank.solo.lose}
                    winrate={player.rank.solo.winrate}
                />
            </div>
            <div className='m-2'>
                <Rank
                    title={'Flex'}
                    rank={player.rank.flex.rank}
                    image={player.rank.flex.image}
                    lp={player.rank.flex.lp}
                    win={player.rank.flex.win}
                    lose={player.rank.flex.lose}
                    winrate={player.rank.flex.winrate}
                />
            </div>
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

        return (
            <div className='flex justify-end items-end m-1'>
                <span className='mx-2'>{statTitle(title)}</span>
                <div className='w-96'>
                    <div className='relative h-px text-center text-white'>
                        <div className='absolute left-2 top-0 text-sm'>{l_value}</div>
                        <div className='-translate-y-2 text-2xl'>|</div>
                        <div className='absolute right-2 top-0 text-sm'>{r_value}</div>
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
            <div className='container mx-auto p-4'>
                <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                    {props.data.map((player, idx) => (
                        <div
                            key={idx}
                            className={`p-2 cursor-pointer ${styles.card} ${playerSelected(idx)}`}
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
                                    <h2 className='text-xl'>{player.name}</h2>
                                    <h3>({player.alias})</h3>
                                </div>
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
                <div className='bg-blue-400/25 rounded shadow'>{left != 0 && rankStructure(props.data[left - 1])}</div>
                <div className='bg-red-400/25 rounded shadow'>{right != 0 && rankStructure(props.data[right - 1])}</div>
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
