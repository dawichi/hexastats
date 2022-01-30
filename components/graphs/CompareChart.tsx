import { getStats } from 'utils'
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

const CompareChart = ({playerA,playerB}) => {
	const skills = [
		'max_kills',
		'kda',
		'csmin',
		'assists',
		'kills',
		'deaths'
	]

	const data = []

	{skills.map((skill) => (data.push({
		'subject': skill,
		'A': getStats(playerA)[skill],
		'B': getStats(playerB)[skill],
		'fullMark': 10
	})))}
	  
    return (
		<div className='bg-gray-500'>
			{/* width debe ser el doble de cx para alinear los nombres abajo */}
			<RadarChart cx={375} cy={250} outerRadius={175} width={750} height={500} data={data}>
				<PolarGrid />
				<PolarAngleAxis dataKey="subject" />
				<PolarRadiusAxis angle={30} domain={[0, 15]} />
				<Radar name={playerA.alias} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
				<Radar name={playerB.alias} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
				<Legend />
			</RadarChart>
		</div>
  )
}

export default CompareChart
