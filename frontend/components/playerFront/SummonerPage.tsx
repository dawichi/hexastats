import { Player } from 'interfaces/player'
import RankStructure from './RankStructure'

export default function SummonerPage({ player }: { player: Player }) {
    const a = 5

    return (
        <section className='flex'>
            <header className='m-5'>
                <RankStructure player={player} />
            </header>
        </section>
    )
}
