export default function propTitle(prop: string) {
	const props = {
		'games': 'Games Played',
		'winrate': 'Winrate',
		'kda': 'KDA',
		'kills': 'Kills',
		'deaths': 'Deaths',
		'assists': 'Assists',
		'cs': 'Farm total',
		'csmin': 'CS / Min',
	}
	
	if (props[prop] !== undefined) {
		return props[prop]
	}
	return prop
}