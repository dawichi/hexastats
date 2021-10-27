import React from 'react'
import PieChart from './PieChart'

const ChartCard = ({title, data, data_int, id}) => {
	let best1 = data_int[0]
	let best2 = data_int[1]
	let best3 = data_int[2]

	data.map(x => {
		if (x.value == best1) best1 = x.label
		if (x.value == best2) best2 = x.label
		if (x.value == best3) best3 = x.label
	})

	return (
		<div className="col-lg-4">
			<div className="border shadow rounded m-3">
				<h3 className="text-2xl text-center m-3">{title}</h3>
				<hr style={{width: '85%', margin: 'auto'}} />
				<br/>
				<div className="m-auto" style={{width: '85%'}}>
					<div className="row">
						<div className="col-4">
							<p><span className="bg-yellow-400 p-1 rounded text-white"><i className="bi bi-trophy"></i></span> {best1}</p>
						</div>
						<div className="col-4">
							<p><span className="bg-gray-700 p-1 rounded text-white"><i className="bi bi-trophy"></i></span> {best2}</p>
						</div>
						<div className="col-4">
							<p><span className="bg-yellow-700 p-1 rounded text-white"><i className="bi bi-trophy"></i></span> {best3}</p>
						</div>
					</div>
				</div>
				<PieChart data={data} outerRadius={120} innerRadius={50} id={id} />
			</div>
		</div>
	)
}

export default ChartCard
