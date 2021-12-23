/* eslint-disable @next/next/no-img-element */
import React, { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Champ, Player } from '../interfaces/interfaces'
import { styles } from '../styles/styles.config'

// ┌────────────────┐
// │ HOME PAGE:     │
// └────────────────┘
// Home page, visualize each player in a table
// Each row of the table is a champ with his stats
const Home = ({ data }) => {
    // Highlights each table cell based on the stat requirements
    const tint = (num: number, type: string) => {
        const tints = {
            games: (x: number) => (x >= 50 ? 'bg-green-200 dark:bg-green-700' : ''),
            winrate: (x: number) => (x >= 55 ? 'bg-sky-200 dark:bg-sky-700' : ''),
            kda: (x: number) => (x >= 3 ? 'bg-purple-200 dark:bg-purple-700 p-1' : ''),
            kills: (x: number) => (x >= 10 ? 'bg-red-200 dark:bg-red-700 p-1' : ''),
            deaths: (x: number) => (x <= 5 ? 'bg-zinc-300 dark:bg-zinc-400 p-1' : ''),
            assists: (x: number) => (x >= 10 ? 'bg-pink-200 dark:bg-pink-700 p-1' : ''),
            csmin: (x: number) => (x >= 7 ? 'bg-yellow-200 dark:bg-yellow-700 p-1' : ''),
        }
        return tints[type]?.(num) ?? ''
    }

    const TintRow = ({ tint, title, data }) => (
        <tr>
            <td className='p-1'>
                <span className={tint}>{title}</span>
            </td>
            <td>{data.toLocaleString('en-US')}</td>
        </tr>
    )

    return (
        <div className='container m-auto py-8 lg:py-16'>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
                {/* For each player, print a table and its table-head */}
                {data.map((player: Player, index_player: number) => (
                    <div key={index_player} className='flex flex-col'>
                        <div className='flex items-center'>
                            <img className='m-3 w-14 rounded' src={player.image} alt={player.name} />
                            <h2 className='text-xl'>
                                {player.name} ({player.alias})
                            </h2>
                        </div>

                        <table className={`table-auto m-3 text-center border dark:border-zinc-500 ${styles.foreground}`}>
                            <thead>
                                <tr>
                                    <th className='py-1 px-2 bg-zinc-300 dark:bg-zinc-800'>Champ</th>
                                    <th className={styles.stat.games}>Games</th>
                                    <th className={styles.stat.kda}>KDA</th>
                                    <th className={styles.stat.kills}>K</th>
                                    <th className={styles.stat.deaths}>D</th>
                                    <th className={styles.stat.assists}>A</th>
                                    <th className={styles.stat.cs}>CSM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* For each champ inside a player, print a row with the data */}
                                {player.champs.map((champ: Champ, index_champ) => (
                                    <tr key={index_champ} className='border dark:border-zinc-500'>
                                        <td>
                                            <Popover className='relative'>
                                                <Popover.Button>
                                                    <img src={champ.image} alt='champ image' className='p-1 w-full' />
                                                </Popover.Button>
                                                <Popover.Panel className='absolute z-10 transform translate-x-1/4 -translate-y-1/2 left-1/2 w-64'>
                                                    <div className={`p-4 border border-zinc-400 shadow-xl rounded-lg ${styles.foreground}`}>
                                                        <img src={champ.image} alt='champ image' className='p-1' />
                                                        <table className='text-right'>
                                                            <TintRow title={'cs'} tint={styles.stat.cs} data={champ.cs} />
                                                            <TintRow title={'cs/min'} tint={styles.stat.cs} data={champ.csmin} />
                                                            <TintRow
                                                                title={<i className='bi bi-currency-exchange'></i>}
                                                                tint={'text-yellow-500'}
                                                                data={champ.gold}
                                                            />
                                                            <TintRow title={'Max Kills'} tint={styles.stat.kills} data={champ.max_kills} />
                                                            <TintRow
                                                                title={'Max Deaths'}
                                                                tint={styles.stat.deaths}
                                                                data={champ.max_deaths}
                                                            />
                                                            <TintRow
                                                                title={'Damage'}
                                                                tint={styles.stat.kills}
                                                                data={champ.avg_damage_dealt}
                                                            />
                                                            <TintRow
                                                                title={<i className='bi bi-shield-shaded'></i>}
                                                                tint={'text-green-500'}
                                                                data={champ.avg_damage_taken}
                                                            />
                                                            <TintRow title={'x 2'} tint={styles.stat.assists} data={champ.double_kills} />
                                                            <TintRow title={'x 3'} tint={styles.stat.games} data={champ.triple_kills} />
                                                            <TintRow title={'x 4'} tint={styles.stat.winrate} data={champ.quadra_kills} />
                                                            <TintRow title={'x 5'} tint={styles.stat.kda} data={champ.penta_kills} />
                                                        </table>
                                                    </div>
                                                </Popover.Panel>
                                            </Popover>
                                        </td>
                                        <td>
                                            <span className={tint(champ.games, 'games')}>{champ.games}</span> (
                                            <span className={tint(champ.winrate, 'winrate')}>{champ.winrate}%</span>)
                                        </td>
                                        <td>
                                            <span className={tint(champ.kda, 'kda')}>{champ.kda}</span>
                                        </td>
                                        <td>
                                            <span className={tint(champ.kills, 'kills')}>{champ.kills}</span>
                                        </td>
                                        <td>
                                            <span className={tint(champ.deaths, 'deaths')}>{champ.deaths}</span>
                                        </td>
                                        <td>
                                            <span className={tint(champ.assists, 'assists')}>{champ.assists}</span>
                                        </td>
                                        <td>
                                            <span className={tint(champ.csmin, 'csmin')}>{champ.csmin}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home
