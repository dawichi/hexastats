import { ChampService, RiotService } from 'services'
import { RankStructure } from 'components'
import { SummonerDto } from 'interfaces'
import { styles } from 'styles/styles.config'

// Local components not exported to the rest of the app
import ChampsList from './ChampsList'
import GamesList from './GamesList'
import PositionStats from './PositionStats'
import FriendsList from './FriendsList'

export default function SummonerPage({ player }: { player: SummonerDto }) {
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
                        <div className={`${styles.background} ${styles.card} m-2 mb-4`}>
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
                        <div className={`${styles.background} ${styles.card} m-2 mb-4`}>
                            <h2 className='text-center text-2xl pt-3'>
                                <i className="bi bi-bar-chart-fill"></i>
                                <span className='m-5'>Positions</span>
                                <i className="bi bi-bar-chart-fill"></i>
                            </h2>
                            <hr className='my-2' />
                            <PositionStats games={player.games} />
                        </div>
                        <div className={`${styles.background} ${styles.card} m-2 mb-4`}>
                            <h2 className='text-center text-2xl pt-3'>
                                <i className="bi bi-person-fill"></i>
                                <span className='m-5'>Friends</span>
                                <i className="bi bi-person-fill"></i>
                            </h2>
                            <hr className='my-2' />
                            <FriendsList friends={champService.friendsCheck(player.games)} />
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
