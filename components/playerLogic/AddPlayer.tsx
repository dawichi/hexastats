import { KeyboardEvent, useContext, useState } from 'react'
import { Listbox } from '@headlessui/react'
import useFormInput from 'hooks/useFormInput'
import { PlayersContext } from 'hooks/PlayersContext'
import axios from 'axios'
import { backend, servers } from 'configs'

const AddPlayer = () => {
    // Search params
    const user = useFormInput('')
    const [server, setServer] = useState<number>(0)

    // Search helpers
    const [searching, setSearching] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    // Context
    const { players, setPlayers } = useContext(PlayersContext)

    // Search logic once the button is pressed
    const handleSearch = async () => {
        setError(false)
        setSearching(true)
        try {
            const response = await axios.get(backend + user.inputProp.value + '&server=' + servers[server])
            const newContext = players.concat(response.data)
            setPlayers(newContext)
            localStorage.setItem('players', JSON.stringify(newContext))
        } catch (e) {
            setError(true)
        }
        setSearching(false)
        user.reset()
    }

    //Search button by pressing enter
    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') handleSearch()
    }

    const loadFriends = async () => {
        const friends = ['Agazhord', 'Alexwwe', 'Brr1', 'BloddSword', 'Dawichii', 'DryadZero', 'Traketero', 'TR0I']
        setSearching(true)
        let players_data = []
        for (let i = 0; i < friends.length; i++) {
            const player = await axios.get(backend + friends[i])
            players_data.push(player.data)
        }
        setPlayers(players.concat(players_data))
        setSearching(false)
    }

    return (
        <div>
            <hr className='md:w-1/2 mx-auto mt-3 p-2' onClick={loadFriends} />
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
                                            `rounded relative p-2 pl-7 ${active ? 'bg-indigo-200 dark:bg-indigo-800' : ''} ${
                                                selected && 'bg-indigo-400 text-white'
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
                    onKeyPress={event => handleKeyPress(event)}
                    className='bg-white dark:bg-zinc-800 p-2 w-full h-12 rounded shadow outline-0 focus:ring-4 ring-indigo-400'
                    type='text'
                    {...user.inputProp}
                    placeholder='Player name'
                />
                <button
                    className='p-2 h-12 rounded text-white font-bold tracking-widest bg-indigo-400 hover:bg-indigo-500 col-span-2 shadow'
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>

            {searching && (
                <div className='flex justify-center items-center mb-5'>
                    <i className='bi bi-arrow-clockwise animate-spin block '></i>
                    <span className='ml-3'>Loading...</span>
                </div>
            )}

            {error && (
                <div className='md:w-96 auto border border-indigo-800 py-3 px-6 mx-auto mb-5 rounded shadow' role='alert'>
                    <strong className='font-bold'>
                        <i className='bi bi-emoji-frown-fill'></i> Oh no!
                    </strong>
                    <p>Sorry, that player doesn&apos;t seem to exist.</p>
                    <p>Is it the correct server ?</p>
                </div>
            )}
        </div>
    )
}

export default AddPlayer
