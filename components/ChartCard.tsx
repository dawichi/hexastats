import React from 'react'
import { DataForChart } from '../interfaces/interfaces'
import { PieChart } from '.'
 

// Prints a card with a chart
// - title: the 'category' of the data in graph
// - data: the data to render in graph [{label: 'name', value: 5}]
// - data_int: array of values present in 'data[x].value'. Used to manage 1º, 2º and 3º ranks
// - id: necessary to print the charts (they must be linked to a HTML id)
const ChartCard = ({title, data, data_int, id}) => {

	// Select the best 3 values (first 3 values of a sorted array)
	let best1 = data_int[0]
	let best2 = data_int[1]
	let best3 = data_int[2]

	// If the value matches with a player's value, then use that player's name (because it's his value)
	// The probability of 2 players having same value is almost 0. (is a float median) So don't worry.
	data.map((x: DataForChart) => {
		if (x.value == best1) best1 = x.label
		if (x.value == best2) best2 = x.label
		if (x.value == best3) best3 = x.label
	})

	// Prints our 3 ranked winners of the {title} category and renders the data with <PieChart/>
	return (
		<div className="border shadow-lg rounded m-3 bg-gray-100 hover:shadow-2xl">
			<h3 className="text-2xl text-center m-3">{title}</h3>
			<hr style={{width: '85%', margin: 'auto'}} />
			<br/>
			<div className="m-auto" style={{width: '85%'}}>
				<div className="grid grid-cols-3">
					<p><span className="bg-yellow-400 p-1 rounded text-white"><i className="bi bi-trophy"></i></span> {best1}</p>
					<p><span className="bg-gray-700 p-1 rounded text-white"><i className="bi bi-trophy"></i></span> {best2}</p>
					<p><span className="bg-yellow-700 p-1 rounded text-white"><i className="bi bi-trophy"></i></span> {best3}</p>
				</div>
			</div>
			<PieChart data={data} outerRadius={120} innerRadius={50} id={id} />
		</div>
	)
}

export default ChartCard