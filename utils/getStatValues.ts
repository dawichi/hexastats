import { Champs, Player, RankResults } from '../interfaces/interfaces'

const getStatValues = (data: Player[], rank_results: RankResults[], prop: string, float?:boolean, calc_median?: boolean, sort_desc?: boolean) => {
	/* - prop: the type of property to load. Ex: 'games', 'winrate' or 'kills'
	*  - float?: by default uses parseInt() for data. Optional parseFloat()
	*  - calc_media?: by default returns total data. Optional returns median.
	*  - sort_desc?: by default returns asc sort. Optional desc sort (when less points is better). 
	*/
	const player_infos = [] // [{label: 'name', value: 5}]
	const player_values = [] // [5]
	// Fills both arrays with dataW
	data.map((player: Player) => {
		let total = 0
		player.champs.map((x: Champs) => total += float ? parseFloat(x[prop]) : parseInt(x[prop]))
		player_infos.push({label: player.name, value: calc_median ? (total/7).toFixed(2) : total})
		player_values.push(calc_median ? (total/7).toFixed(2) : total)
	})
	// Sorts values, asc or desc
	player_values.sort(function(a, b) {
		if (sort_desc) { return a - b }
		else { return b - a }
	})
	// If the best value matches with a player's value, adds 1º cup (value '1') to his trophies array. Same for 2º and 3º rank.
	player_infos.map(player_info => {
		rank_results.map(card => {
			if (player_info.value == player_values[0]) {
				if (player_info.label == card.name) card.trophies.push(1)
			}
			if (player_info.value == player_values[1]) {
				if (player_info.label == card.name) card.trophies.push(2)
			}
			if (player_info.value == player_values[2]) {
				if (player_info.label == card.name) card.trophies.push(3)
			}
		})
	})
	// returns the data built to use it in <PieChart/> components
	// the player values is returned too, to allow show cups in the charts also
	return [player_infos, player_values]
}

export default getStatValues