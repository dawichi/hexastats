import { getStats, statTitle } from 'utils'
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

const CompareChart = ({ playerA, playerB }) => {
    const skills = ['kda', 'csmin', 'avg_damage_dealt', 'avg_damage_taken', 'winrate', 'gold']

    const data = []

    const division = (a, b) => {
        if (a > b) {
            b /= a
            b *= 0.85
            a = 0.85
        } else {
            a /= b
            a *= 0.85
            b = 0.85
        }

        return a
    }

    skills.map(skill =>
        data.push({
            subject: statTitle(skill),
            A: division(getStats(playerA)[skill], getStats(playerB)[skill]),
            B: division(getStats(playerB)[skill], getStats(playerA)[skill]),
        }),
    )

    const axis_stroke = document.documentElement.classList.contains('dark') ? '#FFF' : '#121212'

    return (
        <div className='flex justify-center items-center'>
            {/* width debe ser el doble de cx para alinear los nombres abajo */}
            <ResponsiveContainer height={500} width='100%'>
                <RadarChart cx={'50%'} cy={'50%'} outerRadius={120} data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey='subject' stroke={axis_stroke} />
                    <Radar name={playerA.alias} dataKey='A' stroke='#93c5fd' fill='#93c5fd' fillOpacity={0.6} />
                    <Radar name={playerB.alias} dataKey='B' stroke='#fca5a5' fill='#fca5a5' fillOpacity={0.6} />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CompareChart
