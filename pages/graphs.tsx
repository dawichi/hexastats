import { useContext } from 'react'
import { Container, EmptyPlayers, PieChart, PlayerImg } from 'components'
import { PlayersContext } from 'hooks/PlayersContext'
import { trophyIcon, statTitle, getStats, getValuesForPieChart } from 'utils'
import { Chart, PlayerStatsResult, PlayerTrophies } from 'interfaces/interfaces'
import { styles } from 'styles/styles.config'
import { Player } from 'interfaces/player'

// ┌────────────────┐
// │  GRAPHS PAGE:  │
// └────────────────┘
// Process the data for each category and shows graphs about it
export default function Graphs() {
    const { players } = useContext(PlayersContext)

    const containerProps = {
        title: 'Graphs',
        description: 'Visualize the data in multiple graph types',
    }

    if (!players || players.length === 0) {
        return (
            <Container {...containerProps}>
                <EmptyPlayers />
            </Container>
        )
    }

    const podium: PlayerTrophies[] = []
    const playerStats: PlayerStatsResult[] = []

    // Fill both arrays
    players.forEach((player: Player) => {
        // Podium stores an object for each category with the
        podium.push({
            name: player.alias,
            image: player.image,
            level: player.level,
            trophies: [],
        })
        // playerStats: recopile each stat calculated for each player into an array
        playerStats.push(getStats(player))
    })

    const stats_for_graphs: string[] = [
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

    const charts: Chart[] = []
    let stat_values: {
        name: string
        value: number
    }[] = []

    stats_for_graphs.forEach(stat => {
        stat_values = []
        playerStats.forEach(player => {
            stat_values.push({
                name: player.name,
                value: player[stat],
            })
        })

        // sort "best values" based on which stat we are comparing
        stat_values.sort((a, b) => {
            if (stat != 'deaths') return b.value - a.value
            return a.value - b.value
        })

        // set 1º, 2º and 3º podium
        const gold = podium.findIndex(x => x.name === stat_values[0].name)
        const silver = podium.findIndex(x => x.name === stat_values[1].name)
        const bronze = podium.findIndex(x => x.name === stat_values[2].name)

        podium[gold].trophies.push({ category: stat, result: 1 })
        podium[silver].trophies.push({ category: stat, result: 2 })
        podium[bronze].trophies.push({ category: stat, result: 3 })

        // push the dataForChart into each chart by stat
        charts.push({
            stat: stat,
            data: getValuesForPieChart(playerStats, stat),
        })
    })

    return (
        <Container {...containerProps}>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'>
                {podium.map((podium_card, indx_card) => (
                    <div key={indx_card}>
                        <div className={`p-1 m-2 mt-5 ${styles.card} ${styles.foreground}`}>
                            <div className='flex'>
                                <PlayerImg image={podium_card.image} alias={podium_card.name} level={podium_card.level} />
                                <div className='flex flex-col'>
                                    <span className='pb-1 text-xl'>{podium_card.name}</span>
                                    <div className='mr-1'>
                                        {podium_card.trophies.map((trophy, idx) => (
                                            <p key={idx} className='text-sm'>
                                                {trophyIcon(trophy.result)}
                                                {statTitle(trophy.category)}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PIECHART SECTION */}
            <div className='container mx-auto'>
                <h2 className='text-2xl text-center mt-10 mb-5'>Pie Charts</h2>
                <hr />
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'>
                    {charts.map((chart, idx) => (
                        <div key={idx} className={`m-3 ${styles.foreground} ${styles.card}`}>
                            <h3 className='text-2xl text-center m-3'>{statTitle(chart.stat)}</h3>
                            <hr style={{ width: '85%', margin: 'auto' }} />
                            <br />
                            <div className='grid grid-cols-3 text-sm mx-5'>
                                <span>
                                    {trophyIcon(1)} {chart.data[0].label}
                                </span>
                                <span>
                                    {trophyIcon(2)} {chart.data[1].label}
                                </span>
                                <span>
                                    {trophyIcon(3)} {chart.data[2].label}
                                </span>
                            </div>
                            <PieChart data={chart.data} outerRadius={120} innerRadius={50} id={idx + 1} />
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    )
}
