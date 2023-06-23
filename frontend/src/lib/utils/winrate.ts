export function winrate(wins: number, losses: number): number {
    if (!(wins + losses)) return 0
    return Math.round((wins / (wins + losses)) * 100)
}
