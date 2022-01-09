/* eslint-disable @next/next/no-img-element */
import React, { useContext } from 'react'
import { ChartCard, EmptyPlayers } from '../components'
import { PlayersContext } from '../hooks/PlayersContext'
import { getStatValues, trophyIcon, statTitle } from '../utils'
import { Chart, RankResults } from '../interfaces/interfaces'
import { Player } from '../interfaces/player'
import { styles } from '../styles/styles.config'

// ┌────────────────┐
// │  GRAPHS PAGE:  │
// └────────────────┘
// Process the data with 'process()' function to get the specific
// stats of each category and pass the filtered information to the <PieChart/> components
export default function Graphs() {

    const { players } = useContext(PlayersContext)

	if (!players || players.length === 0) {
        return <EmptyPlayers />
    }

    // Trophies counter for each player
    const rank_results: RankResults[] = []

    players.map((player: Player) => {
        rank_results.push({
            name: player.alias,
            image: player.image,
            trophies: [],
        })
    })

    const charts: Chart[] = []
    // TODO: get props available dynamically
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
        'avg_damage_dealt',
        'avg_damage_taken',
    ]

    stats.forEach(prop => {
        const sort_desc = prop === 'deaths'
        const calc_median = prop !== 'games'
        const [data_stat, data_stat_int] = getStatValues(players, rank_results, prop, calc_median, sort_desc)

        charts.push({
            key: prop,
            title: statTitle(prop),
            data: data_stat,
            data_int: data_stat_int,
        })
    })

    // Sorts player's trophies by value (so it shows 1º, 2º and 3º cups in correct order)
    rank_results.map(card =>
        card.trophies.sort(function (a, b) {
            return a - b
        }),
    )

    return (
        <div className='animate__animated animate__fadeIn'>
            <div className='container-fluid'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'>
                    {rank_results.map((card, indx_card) => (
                        <div key={indx_card}>
                            <div className={`p-1 m-2 mt-5 ${styles.card} ${styles.foreground}`}>
                                <div className='flex'>
                                    <img className='m-2 w-14 h-14 rounded' src={card.image} alt={card.name} />
                                    <div className='flex flex-col'>
                                        <span className='pb-1 text-xl'>{card.name}</span>
                                        <div className='mr-1'>
                                            {card.trophies.map((x, idx) => (
                                                <span key={idx}>{trophyIcon(x)}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PIECHART SECTION */}
            <div className='container mx-auto'>
                <h2 className='text-4xl text-center mt-10 mb-5'>Graphs by stat</h2>
                <hr />
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'>
                    {charts.map((x, index) => (
                        <ChartCard key={index} id={index + 1} title={x.title} data={x.data} data_int={x.data_int} />
                    ))}
                </div>
            </div>
        </div>
    )
}
