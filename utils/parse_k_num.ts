// TODO: check if > 1_000_000 and format it with 'm' at the end
const parse_k_num = (value: number, decimals: number) => (value / 1000 < 1 ? value : (value / 1000).toFixed(decimals) + ' k')

export default parse_k_num
