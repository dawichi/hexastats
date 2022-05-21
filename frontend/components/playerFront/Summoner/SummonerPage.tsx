import { Player } from 'interfaces/Player'
import { ChampService, RiotService } from 'services'
import { styles } from 'styles/styles.config'
import { RankStructure } from 'components'

// Local components not exported to the rest of the app
import ChampsList from './ChampsList'
import GamesList from './GamesList'
import ChampStats from './ChampStats'

export default function SummonerPage({ player }: { player: Player }) {
    const riotService = new RiotService()

    const champService = new ChampService()

    const champs = champService.champsBuilder(player.games)

    return (
        <div
            className='relative rounded-lg shadow'
            style={{
                backgroundImage: `url(${riotService.champSplash(player.masteries[0].name)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <span className='absolute top-3 left-5'>{player.games.length} games loaded</span>
            <section className='bg-orange-50/80 dark:bg-zinc-900/80 pb-12'>
                <header className='py-5'>
                    <RankStructure player={player} />
                </header>

                <div className='grid grid-cols-3'>
                    <section>
                        <div className={`${styles.background} ${styles.card} m-2`}>
                            <h2 className='text-center text-2xl pt-3'>Champions</h2>
                            <div className='grid grid-cols-4 text-center p-2'>
                                <span>Champ</span>
                                <span>Games</span>
                                <span>Winrate</span>
                                <span>KDA</span>
                            </div>
                            <hr className='my-2' />
                            <ChampsList champs={champs} />
                        </div>
                        <div className={`${styles.background} ${styles.card} m-2`}>
                            <h2 className='text-center text-2xl pt-3'>Stats</h2>
                            <hr className='my-2' />
                            <ChampStats games={player.games} />
                        </div>
                    </section>
                    <section className='col-span-2'>
                        <GamesList player={player} />
                    </section>
                </div>
            </section>
        </div>
    )
}
