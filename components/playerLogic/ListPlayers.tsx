import { useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { PlayersContext } from 'hooks/PlayersContext'
import { styles } from 'styles/styles.config'

// Lists a compressed list of players in context
const ListPlayers = () => {
    const { players, setPlayers } = useContext(PlayersContext)

    const router = useRouter()

    const handleDeletePlayer = (player_to_delete: number) => {
        const start = players.slice(0, player_to_delete)
        const end = players.slice(player_to_delete + 1, players.length)
        setPlayers(start.concat(end))
    }

    if (router.pathname === '/') {
        return <></>
    }

    return (
        <div className='border border-x-0 border-t-0 py-2 flex flex-wrap items-center'>
            <div className='flex flex-col justify-center items-center mr-3'>
                <span className='px-2'>Add more</span>
                <Link href='/' passHref>
                    <button
                        title='Add more players'
                        className={`${styles.foreground} ${styles.card} hover:text-white hover:bg-indigo-600 hover:dark:bg-indigo-600 m-1 py-2 px-3 cursor-pointer`}
                    >
                        <i className='bi bi-person-plus-fill'></i>
                    </button>
                </Link>
            </div>
            {players &&
                players.map((player, idx) => (
                    <div
                        key={idx}
                        className={`${styles.foreground} rounded shadow-sm m-1 p-2 relative border border-zinc-300 dark:border-zinc-600`}
                    >
                        <div className='flex justify-center items-end'>
                            <div className='w-12 h-12 rounded overflow-hidden relative'>
                                <Image layout='fill' src={player.image} alt={player.alias} />
                            </div>
                            <span className='ml-2'>{player.alias}</span>

                            <button
                                onClick={() => handleDeletePlayer(idx)}
                                className='p-1 px-2 absolute top-0 right-0 hover:bg-red-500 rounded-sm'
                            >
                                <i className='bi bi-person-x-fill'></i>
                            </button>
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default ListPlayers
