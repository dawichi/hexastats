import { RiotService } from './Riot.service'
import type { ChampDto, GameDto } from '$lib/types'

/**
 * ## Accumulates the game information from a champion
 * To calculate the average information about a champion, we need to accumulate
 * the data from all the games played with it. So with this function, it modifies the values
 * depending of it its an incremental value (like number of games played) or an average (like the winrate)
 *
 * @param {ChampDto} acc Accumulated data object
 * @param {ChampDto} cur Current data object
 * @returns {ChampDto} Modified accumulated data object
 */
function accChamp(acc: ChampDto, cur: ChampDto): ChampDto {
    const avg = (a: number, b: number, n: number) => parseFloat(((a * n + b) / (n + 1)).toFixed(1))

    const props_max = ['maxKills', 'maxDeaths']
    const props_increment = ['doubleKills', 'tripleKills', 'quadraKills', 'pentaKills', 'winrate']
    const props_average = [
        'kills',
        'deaths',
        'assists',
        'kda',
        'cs',
        'csmin',
        'gold',
        'avgDamageTaken',
        'avgDamageDealt',
        'visionScore',
    ]

    // Max props: return the bigger value between the accumulated value and the new value
    for (const prop of props_max) {
        acc[prop] = cur[prop] > acc[prop] ? cur[prop] : acc[prop]
    }

    // Incremental props: just add the new value to the accumulated value
    for (const prop of props_increment) {
        acc[prop] += cur[prop]
    }

    // Average props: calculate the average of the accumulated value and the new value
    for (const prop of props_average) {
        acc[prop] = avg(acc[prop], cur[prop], acc.games)
    }

    // Don't accumulate games before to don't break averages for loop
    acc.games += 1

    return acc
}

/**
 * ## Calculates the kda
 * (kills + assists) / deaths
 *
 * @param kills The number of kills
 * @param deaths The number of deaths
 * @param assists The number of assists
 * @returns The kda value
 */
function kda(kills: number, deaths: number, assists: number) {
    return parseFloat((deaths ? (kills + assists) / deaths : kills + assists).toFixed(1))
}

/**
  * ## Calculates the value per minute
  * (60 * val) / time
  *
  * @param value The value to calculate
  * @param time The time in seconds
  * @returns
  */
const perMin = (value: number, time: number) => parseFloat(((60 * value) / time).toFixed(1))

/**
 * ## Parse data from one single champ based on a game
 *
 * @param game The game to calculate the stats from
 * @returns The stats for the champ of that game
 */
function parseChamp(game: GameDto): ChampDto {
    const { kills, deaths, assists } = game.kda
    const riotService = RiotService.getInstance()

    return {
        name: game.championName,
        image: riotService.champImage(game.championName),
        games: 1,
        winrate: game.win ? 1 : 0,
        assists,
        deaths,
        kills,
        kda: kda(kills, deaths, assists),
        cs: game.cs,
        csmin: perMin(game.cs, game.gameDuration),
        gold: game.gold,
        maxKills: kills,
        maxDeaths: deaths,
        visionScore: game.visionScore,
    }
}

/**
 * ## Service to manage the champ stats
 * From the games data, it allows to build the stats for each champ.
 */
export class ChampService {

    /**
     * ## Builds the champs stats based on the games
     *
     * @param games The games to build the stats from
     * @returns The champs stats
     */
    static champsBuilder = (games: GameDto[]): ChampDto[] => {
        const acc: {
            [champName: string]: ChampDto
        } = {}
        // First, index the games by champ name, accumulating the stats
        for (const game of games) {
            const champName = game.participants[game.participantNumber].championName
            acc[champName] = acc[champName] ? accChamp(acc[champName], parseChamp(game)) : parseChamp(game)
        }

        // Convert accummulated wins to actual winrate
        for (const champName in acc) {
            acc[champName].winrate = parseInt(((acc[champName].winrate / acc[champName].games) * 100).toFixed(0))
        }

        // Then, convert the object to an array
        const champs = Object.keys(acc)
            .map(key => acc[key])
            .sort((a, b) => b.games - a.games)
        
        // Trim the array to the top 7 champs
        if (champs.length > 7) {
            champs.length = 7
        }

        return champs
    }
}
