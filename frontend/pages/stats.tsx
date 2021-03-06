import { useContext } from 'react'
import { Popover } from '@headlessui/react'
import { Container, EmptyPlayers, RankStructure } from 'components'
import { PlayersContext } from 'hooks/PlayersContext'
import { SummonerDto } from 'interfaces'
import { styles } from 'styles/styles.config'
import Image from 'next/image'
import { ChampService } from 'services'

// ┌────────────────┐
// │ STATS PAGE:    │
// └────────────────┘
// Visualize each player in a table
// Each row of the table is a champ with his stats
export default function Home() {
    const champService = new ChampService()

    const { players } = useContext(PlayersContext)

    const containerProps = {
        title: 'Stats',
        description: 'Basic stats of your 7 most played champs',
    }

    if (!players || players.length === 0) {
        return (
            <Container {...containerProps}>
                <EmptyPlayers />
            </Container>
        )
    }

    // ┌────────────────────────────────────────────────────────────
    // │ Highlights each table cell based on the stat requirements
    // └────────────────────────────────────────────────────────────
    const tint = (num: number, type: string): string => {
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

    // ┌──────────────────────────────────
    // │ Returns a row of a table <tr>
    // └──────────────────────────────────
    const TintRow = ({ tint, title, data }: { tint: string; title: any; data: number }) => (
        <tr>
            <td className='p-1'>
                <span className={tint}>{title}</span>
            </td>
            <td>{data.toLocaleString('en-US')}</td>
        </tr>
    )

    return (
        <Container {...containerProps}>
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
                {/* For each player, print a table and its table-head */}
                {players.map((player: SummonerDto, index_player: number) => (
                    <div key={index_player} className={`flex flex-col ${styles.foreground} ${styles.card}`}>
                        <div className='p-4'>
                            <RankStructure player={player} />
                        </div>

                        <table className={`table-auto m-3 text-center border dark:border-zinc-500`}>
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
                                {champService.champsBuilder(player.games).map((champ, index_champ) => (
                                    <tr key={index_champ} className='border dark:border-zinc-500'>
                                        <td>
                                            <Popover className='relative'>
                                                <Popover.Button>
                                                    <div className='p-1 mt-2 w-10 relative h-10 justify-center'>
                                                        <Image src={champ.image} alt='champ image' layout='fill' />
                                                    </div>
                                                </Popover.Button>
                                                <Popover.Panel className='absolute z-10 transform translate-x-1/4 -translate-y-1/2 left-1/2 w-64'>
                                                    <div className={`p-4 border border-zinc-400 shadow-xl rounded-lg ${styles.foreground}`}>
                                                        <div className='p-1 ml-2 w-10 relative h-10'>
                                                            <Image src={champ.image} alt='champ image' layout='fill' />
                                                        </div>
                                                        <table className='text-right'>
                                                            <tbody>
                                                                <TintRow title={'cs'} tint={styles.stat.cs} data={champ.cs} />
                                                                <TintRow title={'cs/min'} tint={styles.stat.cs} data={champ.csmin} />
                                                                <TintRow
                                                                    title={<i className='bi bi-currency-exchange'></i>}
                                                                    tint={'text-yellow-500'}
                                                                    data={champ.gold}
                                                                />
                                                                <TintRow
                                                                    title={'Max Kills'}
                                                                    tint={styles.stat.kills}
                                                                    data={champ.maxKills}
                                                                />
                                                                <TintRow
                                                                    title={'Max Deaths'}
                                                                    tint={styles.stat.deaths}
                                                                    data={champ.maxDeaths}
                                                                />
                                                                <TintRow
                                                                    title={'Damage'}
                                                                    tint={styles.stat.kills}
                                                                    data={champ.avgDamageDealt}
                                                                />
                                                                <TintRow
                                                                    title={<i className='bi bi-shield-shaded'></i>}
                                                                    tint={'text-green-500'}
                                                                    data={champ.avgDamageTaken}
                                                                />
                                                                <TintRow
                                                                    title={'x 2'}
                                                                    tint={styles.stat.assists}
                                                                    data={champ.doubleKills}
                                                                />
                                                                <TintRow title={'x 3'} tint={styles.stat.games} data={champ.tripleKills} />
                                                                <TintRow
                                                                    title={'x 4'}
                                                                    tint={styles.stat.winrate}
                                                                    data={champ.quadraKills}
                                                                />
                                                                <TintRow title={'x 5'} tint={styles.stat.kda} data={champ.pentaKills} />
                                                            </tbody>
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
        </Container>
    )
}
