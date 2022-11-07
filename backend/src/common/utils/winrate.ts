/**
 * ## Winrate - Calculate the winrate in percentage
 * @param wins number of wins
 * @param losses number of losses
 * @returns winrate in percentage
 */
export function winrate(wins: number, losses: number): number {
    if (!(wins + losses)) return 0
    return Math.round((wins / (wins + losses)) * 100)
}
