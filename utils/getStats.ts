import { Player } from '../interfaces/player'
import { PlayerStatsResult } from '../interfaces/interfaces'

/*
 *  Returns the stats calculated for that player based on its 7 champs stats
 */
export default function getStats(player: Player) {
    const result: PlayerStatsResult = {
        name: player.name,
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

    // TODO: get dinamically this
    const stats: string[] = [
        'winrate',
        'kda',
        'kills',
        'deaths',
        'assists',
        'cs',
        'csmin',
        'gold',
        'max_kills',
        'max_deaths',
        'avg_damage_dealt',
        'avg_damage_taken',
    ]

    // Calculate the total games of that player
    player.champs.map((champ, idx) => {
        result.games += champ.games
        result.double_kills += champ.double_kills
        result.triple_kills += champ.triple_kills
        result.quadra_kills += champ.quadra_kills
        result.penta_kills += champ.penta_kills
    })

    stats.map((stat, idx) => {
        let games = 0
        let stat_value = 0

        player.champs.map((champ, idx) => {
            games += champ.games
            stat_value += champ.games * champ[stat]
        })

        result[stat] = parseFloat((stat_value / games).toFixed(2))
    })

    return result
}
