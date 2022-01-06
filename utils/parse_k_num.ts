const parse_k_num = (value: number, decimals: number) => (value / 1000 < 1 ? value : (value / 1000).toFixed(decimals) + ' k')

export default parse_k_num
