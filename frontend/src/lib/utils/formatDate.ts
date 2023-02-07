/**
 * Format a date in a custom style
 * Format following the style: "2 days ago", "1 week ago", "2 months ago", "1 year ago"
 * @param gameDate date of the game creation in milliseconds
 * @param secondsPlayed seconds played during the game
 * @returns time passed since the game finished
 */
export function formatDate(gameCreation: number, secondsPlayed: number): string {
    const date = new Date(gameCreation)
    const now = new Date()
    const diff: number = now.getTime() - date.getTime()
    const seconds = Number((diff / 1000).toFixed(0)) - secondsPlayed

    const text = (divisor: number, text: string) => `${Math.floor(seconds / divisor)} ${text}${Math.floor(seconds / divisor) > 1 ? 's' : ''} ago`

    if (seconds < 60) return `${seconds} seconds ago`
    if (seconds < 3600) return text(60, 'minute')
    if (seconds < 86400) return text(3600, 'hour')
    if (seconds < 604800) return text(86400, 'day')
    if (seconds < 2592000) return text(604800, 'week')
    if (seconds < 31536000) return text(2592000, 'month')
    return text(31536000, 'year')
}
