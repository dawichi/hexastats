import { Listbox } from '@headlessui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { backend, servers } from '../configs'
import useFormInput from '../hooks/useFormInput'
import { Player } from '../interfaces/player'
import { styles } from '../styles/styles.config'



// ┌────────────────┐
// │ INDEX PAGE:    │
// └────────────────┘
// Welcome page, basic landing with a image
export default function Index() {

	const user = useFormInput('')
	const [searching, setSearching] = useState(false)
	const [server, setServer] = useState(0)
	const [data, setData] = useState<Player>()

	const handleSubmit = async () => {
		console.log('basdfkasbdjhfgvb')
		setSearching(true)
		const response = await axios.get(backend + user.value)
		setData(response.data)
		setSearching(false)
	}

	// TODO: Complete a little the landing page, no idea how or with what
	return (
		<div className='animate__animated animate__fadeIn min-h-screen container m-auto py-8 lg:py-16'>
			<h1 className='text-center text-4xl mt-10 mb-5'>Welcome to hexastats</h1>

			<div className='md:w-1/2 mx-auto'>
				<hr />
			</div>

			<div className='sm:w-96 p-5 m-auto grid grid-cols-2 gap-4'>
				<Listbox value={server} onChange={setServer}>
					<div className="relative select-none cursor-pointer rounded shadow">
						<Listbox.Button className='p-2 m-auto pl-5 w-full h-12 rounded relative text-left bg-white dark:bg-zinc-800 hover:shadow-md'>
							<span className="block truncate">{servers[server]}</span>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<i className="bi bi-chevron-expand"></i>
							</span>
						</Listbox.Button>
						<Listbox.Options className='bg-white dark:bg-zinc-800 mt-2 absolute w-full overflow-auto rounded-md shadow-xl z-10'>
							<div className='grid grid-cols-2 gap-x-1'>
								{servers.map((server, idx) => (
									<Listbox.Option
										key={idx}
										value={idx}
										className={({ active, selected }) => `${active ? 'bg-indigo-200 dark:bg-indigo-800' : ''} ${selected && 'bg-indigo-400 text-white'} rounded relative p-2 pl-7`}
									>
										{({ selected }) => (
											<>
												<span className={`${selected ? 'font-medium' : ''} block truncate`}>
													{server}
												</span>
												{selected ? (
													<span className='absolute inset-y-0 left-0 flex items-center pl-1'>
														<i className="bi bi-check"></i>
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</div>
						</Listbox.Options>
					</div>
				</Listbox>
				<input className='bg-white dark:bg-zinc-800 p-2 w-full h-12 rounded shadow' type="text" {...user} placeholder="Username" />
				<button
					className='p-2 h-12 rounded text-white font-bold tracking-wider bg-indigo-300 col-span-2 shadow'
					onClick={handleSubmit}
				>
					Search
				</button>
			</div>
			
			{searching && <p>searching...</p>}

			{data&& data.name}

			<div className='mt-10 md:w-1/2 mx-auto'>
				<img src='/images/programming.svg' className='w-full opacity-80 px-10' />
			</div>
		</div>
	)
}



