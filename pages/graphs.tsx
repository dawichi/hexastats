import React from 'react'
import * as d3 from 'd3'
import PieChart from '../components/PieChart'


export default function Graphs() {
	const data = [
		{label: "🍊", value: 12},
		{label: "🍇", value: 9},
		{label: "🍏", value: 8},
		{label: "🍌", value: 7},
		{label: "🍐", value: 6},
		{label: "🍋", value: 5},
		{label: "🍎", value: 4},
		{label: "🍉", value: 3}
	]
	
	return (
		<div>
			<PieChart
				data={data}
				outerRadius={150}
				innerRadius={100}
			/>
		</div>
	)
}