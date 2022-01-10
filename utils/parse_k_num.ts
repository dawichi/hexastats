//	Parses a number like '2_000_000' to '2000 k' or '2 m'
const parse_k_num = (value: number, number_decimals: number, transform_millions: boolean) => {
    if (!transform_millions) {
        return value / 1000 < 1 ? value : (value / 1000).toFixed(number_decimals) + ' k'
    } else {
        return value / 1000 ** 2 < 1 ? parse_k_num(value, number_decimals, false) : (value / 1000 ** 2).toFixed(number_decimals) + ' m'
    }
}
export default parse_k_num
