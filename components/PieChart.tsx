import React, { useEffect } from 'react'
import * as d3 from 'd3'

export default function PieChart(props: { data: any, outerRadius: number, innerRadius: number, id: number }) {
	
	/*	Prints chart based in a object param
	props = {
		outerRadius,
		innedRadius,
		data
	}
	data = [
		{label: '', value: 1}
	]
	*/

	const {
		data,
		outerRadius,
		innerRadius,
	} = props

	const margin = {
		top: 50, right: 50, bottom: 50, left: 50,
	}
	const width = 2 * outerRadius + margin.left + margin.right
	const height = 2 * outerRadius + margin.top + margin.bottom

	const colorScale = d3     
		.scaleSequential()      
		.interpolator(d3.interpolateRainbow)      
		.domain([0, data.length]);

	useEffect(() => {
		drawChart()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.data])

	const drawChart = () => {
		
		// Remove old svg
		d3.select('#pie-container-' + props.id)
			.select('svg')
			.remove();

		// Create new svg
		const svg = d3
			.select('#pie-container-' + props.id)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height / 2})`);
	
		const arcGenerator = d3
			.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius);

		const pieGenerator = d3
			.pie()
			.padAngle(0)
			.value((d: { value: any }) => d.value);

		const arc = svg
			.selectAll()
			.data(pieGenerator(data))
			.enter();
		
		// Append sectors
		arc
			.append('path')
			.attr('d', arcGenerator)
			.style('fill', (_: any, i: any) => colorScale(i))
			.style('stroke', '#ffffff')
			.style('stroke-width', 0);

		// Append text labels
		arc
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'middle')
			.text((d: { data: { label: string } }) => d.data.label)
			.style('fill', '#000')
			.style('font-size', '.8rem')
			.attr('transform', (d: any) => {
				const [x, y] = arcGenerator.centroid(d);
				return `translate(${x}, ${y})`;
			})

		// Append text values
		arc
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'middle')
			.text((d: { data: { value: string } }) =>  d.data.value)
			.style('fill', '#000')
			.style('font-size', '.8rem')
			.attr('transform', (d: any) => {
				const [x, y] = arcGenerator.centroid(d);
				return `translate(${x}, ${y+20})`;
			})
	}
	
	return (
		<div id={`pie-container-${props.id}`} />
	)
}