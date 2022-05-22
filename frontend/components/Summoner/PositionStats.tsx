import Image from 'next/image'
import { RiotService } from 'services'
import { GameDto } from 'interfaces'

/**
 * ## ChampStats component
 * Displays the stats from the champs you have played.
 *
 * @param props.games - Games list to build the stats from
 */
export default function ChampStats({ games }: { games: GameDto[] }) {
    const riotService = new RiotService()

    const ProgressBar = ({ numGames, wins, max }: { numGames: number; wins: number; max: number }) => {
        const baseHeight = `${(numGames / max) * 100}%`
        const height = `${(wins / numGames) * 100}%`

        return (
            <div className='flex justify-center h-16'>
                <span className='flex w-2 rounded bg-red-400' style={{ height: baseHeight }}>
                    <span className='w-2 rounded bg-green-400' style={{ height }} />
                </span>
            </div>
        )
    }

    // Positions structure:
    const positions: {
        [key: string]: {
            num: number
            wins: number
        }
    } = {
        TOP: { num: 0, wins: 0 },
        JUNGLE: { num: 0, wins: 0 },
        MIDDLE: { num: 0, wins: 0 },
        BOTTOM: { num: 0, wins: 0 },
        UTILITY: { num: 0, wins: 0 },
    }

    // Fill the positions
    games.map(game => {
        // Don't use ?? as it comes as '' instead of null or undefined
        const position = game.participants[game.participantNumber].teamPosition || 'MIDDLE'
        positions[position].num++
        positions[position].wins += game.participants[game.participantNumber].win ? 1 : 0
    })

    // Check the maximum number of games
    let maxGames = 0
    Object.keys(positions).map(position => {
        if (positions[position].num > maxGames) {
            maxGames = positions[position].num
        }
    })

    // TODO: Add winrate text for each position and the global winrate below
    return (
        <div className='grid grid-cols-5 pb-5'>
            {Object.keys(positions).map((position, idx) => (
                <div key={idx} className='flex flex-col text-center'>
                    {positions[position].num}
                    <span>
                        <Image src={riotService.teamPositionIcon(position)} width={35} height={35} alt='position' />
                    </span>
                    <ProgressBar numGames={positions[position].num} wins={positions[position].wins} max={maxGames} />
                </div>
            ))}
        </div>
    )
}
