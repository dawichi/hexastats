/**
 * Parses a number like '2_000_000' to '2000 k' or '2 m'
 * @param value the number to parse
 * @param number_decimals opt: the number of decimals 
 * @param transform_millions opt: show 7m instead of 7000k
 * @returns {string} the string formatted
 */
export const parse_k_num = (value: number, number_decimals: number = 0, transform_millions: boolean = false): string => {
    if (!transform_millions) {
        return value / 1000 < 1 ? value.toString() : (value / 1000).toFixed(number_decimals) + ' k'
    } else {
        return value / 1000 ** 2 < 1 ? parse_k_num(value, number_decimals, false) : (value / 1000 ** 2).toFixed(number_decimals) + ' m'
    }
}
