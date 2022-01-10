// TODO: check if > 1_000_000 and format it with 'm' at the end
const parse_k_num = (value: number, number_decimals: number , transform_millions: boolean) => 
	{
	if (!transform_millions){
		return value / 1000 < 1 ? value : (value / 1000).toFixed(number_decimals) + ' k'
	}
	else{
		return value / 1000**2 < 1 ? parse_k_num(value, number_decimals, false) : (value / 1000**2).toFixed(number_decimals) + ' M'
	}	
}
export default parse_k_num
