/**
 * ## Interface for a champ information.
 * Used when calculating the stats for a character,
 * based in all the games with that champion.
 */
export interface ChampDto {
    [key: string]: number | string;
    name: string
    image: string
    games: number
    winrate: number
    kda: number
    kills: number
    deaths: number
    assists: number
    cs: number
    csmin: number
    gold: number
    maxKills: number
    maxDeaths: number
    avgDamageDealt: number
    avgDamageTaken: number
    visionScore: number
    doubleKills: number
    tripleKills: number
    quadraKills: number
    pentaKills: number
}
