import { useEffect } from 'react'
import * as d3 from 'd3'
import { DataForChart } from 'interfaces/interfaces'
import { parse_k_num } from 'utils'

// ┌────────────────┐
// │  PieChart:     │
// └────────────────┘
// Prints a pie chart based on the info recieved in the props
export default function PieChart(props: { id: number; innerRadius: number; outerRadius: number; data: DataForChart[] }) {
    const margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    }

    const width = 2 * props.outerRadius + margin.left + margin.right
    const height = 2 * props.outerRadius + margin.top + margin.bottom

    const colorScale = d3.scaleSequential().interpolator(d3.interpolateRainbow).domain([0, props.data.length])

    const DrawChart = () => {
        // Remove old svg
        d3.select('#pie-container-' + props.id)
            .select('svg')
            .remove()

        // Create new svg
        const svg = d3
            .select('#pie-container-' + props.id)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`)

        const arcGenerator = d3.arc().innerRadius(props.innerRadius).outerRadius(props.outerRadius)

        const pieGenerator = d3
            .pie()
            .padAngle(0)
            .value((d: { value: any }) => d.value)

        const arc = svg.selectAll().data(pieGenerator(props.data)).enter()

        // Append sectors
        arc.append('path')
            .attr('d', arcGenerator)
            .style('fill', (_: any, i: any) => colorScale(i))
            .style('stroke', '#ffffff')
            .style('stroke-width', 0)

        // Append text labels
        arc.append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text((d: { data: { label: string } }) => d.data.label)
            .style('fill', '#000')
            .style('font-size', '.8rem')
            .attr('transform', (d: any) => {
                const [x, y] = arcGenerator.centroid(d)

                return `translate(${x}, ${y})`
            })

        // Append text values
        arc.append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text((d: { data: { value: string } }) => parse_k_num(parseFloat(d.data.value), 2, true))
            .style('fill', '#000')
            .style('font-size', '.8rem')
            .attr('transform', (d: any) => {
                const [x, y] = arcGenerator.centroid(d)

                return `translate(${x}, ${y + 20})`
            })

    }
	
    useEffect(() => {
        DrawChart()
    }, [])

    return <div id={`pie-container-${props.id}`} />
}
