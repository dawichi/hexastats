/**
 * ## Calculates the kda
 * (kills + assists) / deaths
 *
 * @param kills The number of kills
 * @param deaths The number of deaths
 * @param assists The number of assists
 * @returns The kda value
 */
export function kda(kills: number, deaths: number, assists: number) {
    return parseFloat((deaths ? (kills + assists) / deaths : kills + assists).toFixed(2))
}
