import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backend, players } from '../config'
import { ChartCard, ProgressByPlayer } from '../components'
import { getStatValues, trophyIcon, statTitle, Rank } from '../utils'
import { Chart, Player, RankResults } from '../interfaces/interfaces'
import { styles } from '../styles/styles.config'

// ┌────────────────┐
// │ Compare PAGE:  │
// └────────────────┘
// Allows to select 2 players and compares its stats
export default function Compare(props: { data: Player[] }) {
    // Players selected for compare
    const [left, setLeft] = useState(0)
    const [right, setRight] = useState(0)

    const handleSelect = (idx: number) => {
        if (!left) setLeft(idx + 1)
        else if (!right) setRight(idx + 1)
        else {
            if (idx + 1 === left) setLeft(0)
            if (idx + 1 === right) setRight(0)
        }
    }

    const playerSelected = (idx: number) => {
        if (idx + 1 === left) return 'bg-blue-400'
        if (idx + 1 === right) return 'bg-red-400'
        return ''
    }

    const progressBar = (percent: number, title: string, reverse: boolean) => (
        <>
            <span>{title}</span>
            <div className={`bg-zinc-200 dark:bg-zinc-700 h-3 rounded flex ${reverse ? 'justify-end' : ''}`}>
                <div className='bg-teal-500 h-3 rounded' style={{ width: `${percent}%` }}></div>
            </div>
        </>
    )

    const playerData = (player: Player, reverse: boolean) => (
        <div>
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
            {progressBar(100 - player.rank.rank_p, 'Global rank', reverse)}
            {progressBar(100 - player.rank.rank_p, 'Global rank', reverse)}
        </div>
    )

    return (
        <div className='animate__animated animate__fadeIn'>
            <div className='container mx-auto p-4'>
                <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                    {props.data.map((player, idx) => (
                        <div
                            key={idx}
                            className={`p-2 cursor-pointer ${styles.foreground} ${styles.card} ${playerSelected(idx)}`}
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
            <div className='container-fluid p-4 grid gap-4 grid-cols-2'>
                <div className='bg-blue-200 p-4'>
                    <p>LADO AZUL (LEFT)</p>
                    <p>index: {left}</p>
                    {left && playerData(props.data[left - 1], false)}
                </div>
                <div className='bg-red-200 p-4'>
                    <p>LADO ROJO (RIGHT)</p>
                    <p>index: {right}</p>
                    {right && playerData(props.data[right - 1], true)}
                </div>
            </div>
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
