/**
 * Parses a number like '1058'(seconds) to '17:38'(minutes)
 * @param value the number to parse
 * @returns {string} the string formatted
 */
export const secondsToMin = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const formattedSeconds = (seconds % 60).toFixed(0).padStart(2, '0')
    return `${minutes}:${formattedSeconds}`
}
