import { Player, PlayerStats } from '../interfaces/interfaces'

export default function getStatValues(player: Player, prop_keys: string[]) {

	const player_stats: PlayerStats[] = []

	// Fill the player_stats template with the data
	prop_keys.forEach(prop => {
		let games = 0
		let stat = 0

		player.champs.map(champ => {
			if (prop === 'games') {
				stat += champ[prop]
			} else {
				games += champ.games
				stat += champ.games * champ[prop]
			}
		})

		player_stats.push({
			key: prop,
			value: (prop === 'games') ? stat : parseFloat((stat/games).toFixed(2))
		})
	})

	return {
		name: player.name,
		data: player_stats
	}
	// Sorts values, asc or desc
	// player_stats.sort(function(a, b) {
	// 	if (true) { return a - b }
	// 	else { return b - a }
	// })
}