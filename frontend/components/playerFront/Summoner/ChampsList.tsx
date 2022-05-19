import { RiotService } from 'services'
import { Champ } from 'interfaces/Player'
import Image from 'next/image'

export default function ChampsList({ champs }: {
    champs: Champ[]
}) {
    const riotService = new RiotService()

    return (
        <div>
            {champs.map((champ, idx) => (
                <div key={idx} className='grid grid-cols-4'>
                    <Image className='rounded' src={riotService.champImage(champ.name)} alt='champion' width={100} height={100} />
                    <span>{champ.games}</span>
                    <span>{champ.winrate}</span>
                    <span>{champ.kda}</span>
                </div>
            ))}
        </div>
    )
}
