import { ChampDto } from 'src/interfaces'

/**
 * ## Accumulates the game information from a champion
 * To calculate the average information about a champion, we need to accumulate
 * the data from all the games played with it. So with this function, it modifies the values
 * depending of it its an incremental value (like number of games played) or an average (like the winrate)
 * @param {ChampDto} acc Accumulated data object
 * @param {ChampDto} cur Current data object
 * @returns {ChampDto} Modified accumulated data object
 */
export const accumulateGameData = (acc: ChampDto, cur: ChampDto): ChampDto => {
    const avg = (a: number, b: number, n: number) => parseFloat(((a * n + b) / (n + 1)).toFixed(2))

    const props_increment = ['doubleKills', 'tripleKills', 'quadraKills', 'pentaKills', 'winrate']
    const props_average = [
        'kills',
        'deaths',
        'assists',
        'kda',
        'cs',
        'csmin',
        'avgDamageTaken',
        'avgDamageDealt',
        'visionScore',
        'timePlayed',
        'turretKills',
    ]
    const props_max = ['maxKills', 'maxDeaths']

    // Incremental props: just add the new value to the accumulated value
    for (const prop of props_increment) {
        acc[prop] += cur[prop]
    }

    // Average props: calculate the average of the accumulated value and the new value
    for (const prop of props_average) {
        acc[prop] = avg(acc[prop], cur[prop], acc.games)
    }

    // Max props: return the bigger value between the accumulated value and the new value
    for (const prop of props_max) {
        acc[prop] = cur[prop] > acc[prop] ? cur[prop] : acc[prop]
    }

    // Don't accumulate games before to don't break averages for loop
    acc.games += 1
    return acc
}
