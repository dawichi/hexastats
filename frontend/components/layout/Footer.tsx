import Link from 'next/link'

/**
 * ## Footer component
 * Renders the footer of the website, with link and copyright
 */
const Footer = () => (
    <footer className='bg-zinc-800 text-white p-3'>
        <div className='container m-auto'>
            <div className='flex items-center mb-5'>
                <a href='https://github.com/dawichi' target='_blank' className='hover:text-indigo-400 text-xl' rel='noreferrer'>
                    다 위 치
                </a>
                <i className='bi bi-suit-diamond-fill mx-5 text-sm'></i>
                <Link href='/about' passHref>
                    <button className='p-1 hover:text-indigo-400'>About us</button>
                </Link>
            </div>
            <p>
                <span>&copy; {new Date().getFullYear().toString()} </span>
                <a
                    className='text-indigo-400 font-bold tracking-wider'
                    href='https://github.com/dawichi/hexastats'
                    target='_blank'
                    rel='noreferrer'
                >
                    Hexastats
                </a>{' '}
                isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot Games or anyone officially involved
                in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot
                Games, Inc. League of Legends © Riot Games, Inc.
            </p>
            <div className='flex items-center justify-center my-5'>
                <a target='_blank' href='https://www.buymeacoffee.com/dawichi' rel='noreferrer'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className='w-64 h-24'
                        src='https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=dawichi&button_colour=818cf8&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00'
                        alt='Coffee'
                    />
                </a>
            </div>
        </div>
    </footer>
)

export default Footer
