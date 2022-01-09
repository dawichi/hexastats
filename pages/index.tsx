import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Listbox } from '@headlessui/react'
import { RankStructure } from '../components'
import { backend, servers } from '../configs'
import useFormInput from '../hooks/useFormInput'
import { PlayersContext } from '../hooks/PlayersContext'
import Link from 'next/link'

// ┌────────────────┐
// │ INDEX PAGE:    │
// └────────────────┘
// Welcome page, basic landing with a image
export default function Index() {
	// Search params
	const user = useFormInput('')
	const [server, setServer] = useState<number>(0)

	// Helpers for search
	const [searching, setSearching] = useState<boolean>(false)
	const [error, setError] = useState<string>('')

	// Context
	const { players, setPlayers } = useContext(PlayersContext)

	// Search logic once the button is pressed
	const handleSearch = async () => {
		setError('')
		setSearching(true)
		try {
			const response = await axios.get(backend + user.inputProp.value)
			players
				? setPlayers(players.concat(response.data))
				: setPlayers([response.data])
		} catch (e) {
			setError('Sorry, that player doesn\'t seem to exist ;/ try another one !')
		}
		setSearching(false)
		user.reset()
	}

	return (
		<div className='animate__animated animate__fadeIn min-h-screen container m-auto py-8 lg:py-16'>
			<div className='text-center'>
				<Link href='/text'>dasdadssdads</Link>
				<h1 className='text-4xl mt-10 mb-5'>Welcome to hexastats</h1>

				<hr className='md:w-1/2 mx-auto' />

				<div className='my-6'>
					<p>A data visualization tool for League of Legends !</p>
					<p>Search players from multiple servers and start comparing them !</p>
				</div>

				<p>First of all, <br />add the players you would like to compare here</p>
				<p>( Don't worry if you forget anyone, you may add more at any moment )</p>
			</div>

			<div className='sm:w-96 p-5 m-auto grid grid-cols-2 gap-4'>
				<Listbox value={server} onChange={setServer}>
					<div className='relative select-none cursor-pointer rounded shadow'>
						<Listbox.Button className='p-2 m-auto pl-5 w-full h-12 rounded relative text-left bg-white dark:bg-zinc-800 hover:shadow-md focus:ring-4 ring-indigo-400'>
							<span className='block truncate'>{servers[server]}</span>
							<span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
								<i className='bi bi-chevron-expand'></i>
							</span>
						</Listbox.Button>
						<Listbox.Options className='bg-white dark:bg-zinc-800 mt-2 absolute w-full overflow-auto rounded-md shadow-xl z-10'>
							<div className='grid grid-cols-2 gap-x-1'>
								{servers.map((server, idx) => (
									<Listbox.Option
										key={idx}
										value={idx}
										className={({ active, selected }) =>
											`rounded relative p-2 pl-7 ${active ? 'bg-indigo-200 dark:bg-indigo-800' : ''} ${selected && 'bg-indigo-400 text-white'
											}`
										}
									>
										{({ selected }) => (
											<>
												<span className={`${selected ? 'font-medium' : ''} block truncate`}>{server}</span>
												{selected ? (
													<span className='absolute inset-y-0 left-0 flex items-center pl-1'>
														<i className='bi bi-check'></i>
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
				<input
					className='bg-white dark:bg-zinc-800 p-2 w-full h-12 rounded shadow outline-0 focus:ring-4 ring-indigo-400'
					type='text'
					{...user.inputProp}
					placeholder='Player name'
				/>
				<button
					className='p-2 h-12 rounded text-white font-bold tracking-widest bg-indigo-400 col-span-2 shadow'
					onClick={handleSearch}
				>
					Search
				</button>
			</div>

			{searching && (
				<div className='flex justify-center items-center'>
					<i className='bi bi-arrow-clockwise animate-spin block '></i>
					<span className='ml-3'>Loading...</span>
				</div>
			)}

			{error && (
				<div className="md:w-96 auto border border-indigo-800 py-3 px-6 mx-auto rounded shadow" role="alert">
					<strong className="font-bold">Oh no!</strong>
					<span className="block sm:ml-3 sm:inline">{error}</span>
				</div>
			)}

			{players && (
				<div className='flex flex-col justify-center items-center'>
					{players.map(player => {
						return (
							<div className='flex items-center justify-center gap-4 border'>
								<div className='relative flex flex-col items-center text-sm text-white'>
									<img className='m-3 w-14 rounded' src={player.image && player.image} alt={player.alias && player.alias} />
									<span className='px-1 absolute bottom-0 bg-zinc-700 border border-yellow-500 rounded-full'>{player.level}</span>
								</div>
								<div className='flex flex-col'>
									<h2 className='text-xl'>{player.alias && player.alias}</h2>
								</div>
								{player.rank && player.rank.solo && <RankStructure title={'Solo/Duo'} rankdata={player.rank.solo} />}
								{player.rank && player.rank.flex && <RankStructure title={'Flex'} rankdata={player.rank.flex} />}
							</div>
						)
					})}
				</div>
			)}

			<div className='mt-10 md:w-1/2 mx-auto'>
				<img src='/images/programming.svg' className='w-full opacity-80 px-10' />
			</div>
		</div>
	)
}
