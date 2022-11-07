// import { DataForChart, PlayerStatsResult } from 'interfaces/interfaces'

// export const getValuesForPieChart = (playersData: PlayerStatsResult[], stat: string): DataForChart[] => {
//     const player_infos: DataForChart[] = [] // [ {label: 'name', value: 5} ]

//     // Fills it with values
//     playersData.map(player =>
//         player_infos.push({
//             label: player.name,
//             value: player[stat],
//         }),
//     )

//     // Sorts values, asc or desc
//     player_infos.sort((a, b) => {
//         if (stat !== 'deaths') {
//             return b.value - a.value
//         }

//         return a.value - b.value
//     })

//     // returns the data ready to use in <PieChart/> components
//     return player_infos
// }
