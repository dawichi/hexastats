/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Axios from 'axios'
import Navbar from '../components/Navbar'
import Home from '../components/Home'
import PieChart from '../components/PieChart'
import processData from '../utils/processData'

export default function Index(props: { data: any[] }) {

	const context = processData(props.data)
	const [page, setPage] = useState(0)

	const fruits = [
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
		<>
			<header style={{position: 'sticky', top: 0}}>
				<Navbar page={page} setPage={setPage} />
			</header>

			<main>
				<p>page: {page}</p>
				{ page == 0 &&
					<div className="animate__animated animate__fadeIn">
						<Home data={context} />
					</div>
				}
				{ page == 1 &&
					<div className="animate__animated animate__fadeIn">
						<PieChart data={fruits} outerRadius={150} innerRadius={100} /> 
					</div>
				}
				{ page == 2 &&
					<div className="animate__animated animate__fadeIn">
						<div>holi maestrías</div> 
					</div>
				}
			</main>
		</>
	)
}



export const getStaticProps = async () => {
	// Fetch data from euw.op.gg with getStaticProps()'s NextJS function
	const BASE_URL = 'https://euw.op.gg/summoner/userName='

	const alex = await Axios.get(BASE_URL + 'alexwwe')
	const bruno = await Axios.get(BASE_URL + 'Brr1')
	const cristian = await Axios.get(BASE_URL + 'BloddSword')
	const david = await Axios.get(BASE_URL + 'Dawichii')
	const marcos = await Axios.get(BASE_URL + 'Agazhord')
	const rodri = await Axios.get(BASE_URL + 'Traketero')
	const samu = await Axios.get(BASE_URL + 'DryadZero')
	const diego = await Axios.get(BASE_URL + 'Rhaast West')

	return {
		props: { data: [
			{name: 'Alex', data: alex.data, alias: 'alexwwe'},
			{name: 'Bruno', data: bruno.data, alias: 'Brr1'},
			{name: 'Cristian', data: cristian.data, alias: 'BloddSword'},
			{name: 'David', data: david.data, alias: 'Dawichii'},
			{name: 'Marcos', data: marcos.data, alias: 'Agazhord'},
			{name: 'Rodri', data: rodri.data, alias: 'Traketero'},
			{name: 'Samu', data: samu.data, alias: 'DryadZero'},
			{name: 'Diego', data: diego.data, alias: 'Rhaast West'},
		] },
	}
}
