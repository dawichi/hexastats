/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Axios from 'axios'
import Navbar from '../components/Navbar'
import Home from '../components/Home'
import processData from '../utils/processData'
import Graphs from '../components/Graphs'

export default function Index(props: { data: any[] }) {

	const context = processData(props.data)
	const [page, setPage] = useState(0)

	return (
		<>
			<header style={{position: 'sticky', top: 0, zIndex: 1}}>
				<Navbar page={page} setPage={setPage} />
			</header>

			<main>
				{ page == 0 &&
					<div className="animate__animated animate__fadeIn">
						<Home data={context} />
					</div>
				}
				{ page == 1 &&
					<div className="animate__animated animate__fadeIn">
						<Graphs data={context}/>
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
	const dawichi = await Axios.get(BASE_URL + 'Dawichii')
	const marcos = await Axios.get(BASE_URL + 'Agazhord')
	const rodri = await Axios.get(BASE_URL + 'Traketero')
	const samu = await Axios.get(BASE_URL + 'DryadZero')
	const diego = await Axios.get(BASE_URL + 'Rhaast West')
	const abel = await Axios.get(BASE_URL + 'DelemKi 26')
	const david = await Axios.get(BASE_URL + 'DAYTRESGP')
	const jose = await Axios.get(BASE_URL + 'Telejenkem')

	const data = [
		{name: 'Alex', data: alex.data, alias: 'alexwwe'},
		{name: 'Bruno', data: bruno.data, alias: 'Brr1'},
		{name: 'Cristian', data: cristian.data, alias: 'BloddSword'},
		{name: 'Dawichi', data: dawichi.data, alias: 'Dawichii'},
		{name: 'Marcos', data: marcos.data, alias: 'Agazhord'},
		{name: 'Rodri', data: rodri.data, alias: 'Traketero'},
		{name: 'Samu', data: samu.data, alias: 'DryadZero'},
		{name: 'Diego', data: diego.data, alias: 'Rhaast West'},
		{name: 'Abel', data: abel.data, alias: 'DelemKi 26'},
		{name: 'David', data: david.data, alias: 'DAYTRESGP'},
		{name: 'Jose', data: jose.data, alias: 'Telejenkem'},
	]

	data.sort((A, B) => {
		if (A.name < B.name) return -1
		if (A.name > B.name) return 1
		return 0
	})

	return {
		props: { data: data},
	}
}
