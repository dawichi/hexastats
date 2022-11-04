/**
 * ## Rank information
 * Shows multiple data about the rank of a player
 * in a league (solo or flex) like LP, winrate, ...
 */
export interface Rank {
    rank: string
    image: string
    lp: number
    win: number
    lose: number
    winrate: number
}
