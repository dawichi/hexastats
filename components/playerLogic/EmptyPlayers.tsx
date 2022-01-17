import Link from 'next/link'
import { styles } from 'styles/styles.config'

const EmptyPlayers = () => {
    return (
        <div className='animate__animated animate__fadeIn h-96 flex flex-col justify-center items-center text-2xl'>
            <i className='bi bi-emoji-frown-fill'></i>
            <h2>There is no players !</h2>
            <p>To visualize their data, add them first !</p>
            <br />
            <p>Go back to Home page</p>
            <Link href='/'>
                <button
                    title='Add more players'
                    className={`${styles.foreground} ${styles.card} hover:text-white hover:bg-indigo-600 hover:dark:bg-indigo-600 m-1 py-2 px-3 cursor-pointer`}
                >
                    <i className='bi bi-person-plus-fill'></i>
                </button>
            </Link>
        </div>
    )
}

export default EmptyPlayers
