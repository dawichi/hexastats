import React from 'react'
import * as d3 from 'd3'
import { getStats, statTitle } from 'utils'
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts'
import { useState } from 'react'

const renderActiveShape = props => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, payload, percent, value, color } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={color}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={color}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={color} fill='none' />
            <circle cx={ex} cy={ey} r={2} fill={color} stroke='none' />
            <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={textAnchor} fill='#333'>{`${payload.name} :  ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={18} textAnchor={textAnchor} fill='#999'>
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        </g>
    )
}

export default function ActivePieChart({ players, title }) {
    const data = []

    const colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), players.length)

    players.map((player, idx) =>
        data.push({
            name: player.alias,
            value: getStats(player)[title],
            color: colors[idx],
        }),
    )

    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <div className='bg-cyan-600 m-3'>
            <h2 className='text-xl text-center mb-3'>{statTitle(title)}</h2>
            <hr style={{ width: '85%', margin: 'auto' }} />
            <PieChart width={450} height={300}>
                <Pie
                    activeIndex={[...players.keys()]}
                    activeShape={renderActiveShape}
                    data={data}
                    cx='50%'
                    cy='50%'
                    innerRadius={50}
                    outerRadius={70}
                    dataKey='value'
                    onMouseEnter={(_, idx) => setActiveIndex(idx)}
                />
            </PieChart>
        </div>
    )
}
