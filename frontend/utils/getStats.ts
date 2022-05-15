import { PlayerDto } from 'interfaces'
import { PlayerStatsResult } from 'interfaces/interfaces'

/**
 * Returns the stats calculated for that player based on its 7 champs stats
 * @param {Player} player object with the player structure
 * @returns {PlayerStatsResult} Object with the stats calculated
 */
export const getStats = (player: PlayerDto): PlayerStatsResult => {
    const result: PlayerStatsResult = {
        name: player.alias,
        image: player.image,
        games: 0,
        winrate: 0,
        kda: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        cs: 0,
        csmin: 0,
        gold: 0,
        max_kills: 0,
        max_deaths: 0,
        avg_damage_dealt: 0,
        avg_damage_taken: 0,
        double_kills: 0,
        triple_kills: 0,
        quadra_kills: 0,
        penta_kills: 0,
    }

    const max_stats = ['max_kills', 'max_deaths']

    // Calculate accumulative stats (total)
    player.champs.map(champ => {
        result.games += champ.games
        result.double_kills += champ.double_kills
        result.triple_kills += champ.triple_kills
        result.quadra_kills += champ.quadra_kills
        result.penta_kills += champ.penta_kills

        max_stats.forEach(stat => {
            if (result[stat] < champ[stat]) {
                result[stat] = champ[stat]
            }
        })
    })

    // Calculate value based on games played (ex: acc kda / games)
    const stats: string[] = ['winrate', 'kda', 'kills', 'deaths', 'assists', 'cs', 'csmin', 'gold', 'avg_damage_dealt', 'avg_damage_taken']

    stats.map(stat => {
        let games = 0
        let stat_value = 0

        player.champs.map(champ => {
            games += champ.games
            stat_value += champ.games * champ[stat]
        })

        if (!games) {
            result[stat] = 0
        }
        else {
            result[stat] = parseFloat((stat_value / games).toFixed(2))
        }
    })

    return result
}
