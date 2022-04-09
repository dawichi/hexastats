import { useContext } from 'react'
import { RankStructure } from 'components'
import { PlayersContext } from 'hooks/PlayersContext'
import { styles } from 'styles/styles.config'

// Lists a extended view of players added in context, with its rank data
const AddedPlayers = () => {
    const { players, setPlayers } = useContext(PlayersContext)

    const handleDeletePlayer = (player_to_delete: number) => {
        const start = players.slice(0, player_to_delete)
        const end = players.slice(player_to_delete + 1, players.length)
        setPlayers(start.concat(end))
        localStorage.setItem('players', JSON.stringify(start.concat(end)))
    }

    if (!players || players.length === 0) {
        return <></>
    }

    return (
        <div className='container mx-auto'>
            <h3 className='text-xl my-3'>Players added: </h3>
            <hr />
            <p className='mt-2 mb-4'>
                <strong>Great !</strong> &nbsp; Now that you have added some players, feel free to explore all the hexastats pages ^^
            </p>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {players &&
                    players.map((player, idx) => (
                        <div key={idx} className={`${styles.foreground} ${styles.card} p-4 relative`}>
                            <RankStructure player={player} />

                            <button
                                onClick={() => handleDeletePlayer(idx)}
                                className='p-1 px-2 absolute top-0 right-0 hover:bg-red-500 rounded-sm'
                            >
                                <i className='bi bi-person-x-fill'></i>
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default AddedPlayers
