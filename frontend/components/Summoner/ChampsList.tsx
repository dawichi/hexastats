import { useState } from 'react'
import Image from 'next/image'
import { RiotService } from 'services'
import { ChampDto } from 'interfaces'

/**
 * ## ChampsList component
 * Display a list of champions with their stats
 *
 * @param props.champs - Champs list to display
 */
export default function ChampsList({ champs }: { champs: ChampDto[] }) {
    const riotService = new RiotService()

    const ProgressBar = ({ max, value, color }: { max: number; value: number; color: number }) => {
        const width = `${(value / max) * 100}%`
        const colors = {
            0: 'bg-blue-400',
            1: 'bg-red-400',
            2: 'bg-green-400',
        }

        return (
            <div className='w-full px-2'>
                <span className=''>{value}</span>
                <div className={`h-2 ${colors[color] ?? colors[0]} rounded`} style={{ width }} />
            </div>
        )
    }

    const [maxGames, setMaxGames] = useState<number>(null)
    const [maxWinrate, setMaxWinrate] = useState<number>(null)
    const [maxKda, setMaxKda] = useState<number>(null)

    return (
        <>
            {champs.map((champ, idx) => {
                if (champ.games > maxGames) {
                    setMaxGames(champ.games)
                }
                if (champ.winrate > maxWinrate) {
                    setMaxWinrate(champ.winrate)
                }
                if (champ.kda > maxKda) {
                    setMaxKda(champ.kda)
                }

                if (idx > 5) {
                    return
                }

                return (
                    <div key={idx} className='grid grid-cols-4 gap-1 px-4'>
                        <span>
                            <Image className='rounded' src={riotService.champImage(champ.name)} alt='champion' width={50} height={50} />
                        </span>
                        <ProgressBar max={maxGames} value={champ.games} color={0} />
                        <ProgressBar max={maxWinrate} value={champ.winrate} color={1} />
                        <ProgressBar max={maxKda} value={champ.kda} color={2} />
                    </div>
                )
            })}
        </>
    )
}
