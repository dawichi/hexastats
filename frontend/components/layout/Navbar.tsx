import { useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { Disclosure, Switch } from '@headlessui/react'
import { navigation } from 'configs'
import { LinkDto } from 'interfaces'

/**
 * ## Render Links
 * Renders the links list to allow the navigation
 *
 * @param props.navigation - Array of links to display in the navbar
 * @param props.router - Router of the app (checks the URL to highlight the current link)
 */
const RenderLinks = ({ navigation, router }: { navigation: LinkDto[]; router: NextRouter }) => (
    <>
        {navigation.map((item, idx) => (
            <Link href={item.url} key={idx} passHref>
                <button
                    key={item.name}
                    className={
                        'block px-3 py-2 rounded-md text-base font-medium ' +
                        (router.pathname === item.url ? 'bg-zinc-900 text-white' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white')
                    }
                >
                    {item.name}
                </button>
            </Link>
        ))}
    </>
)

/**
 * ## Toggle component
 * Toggles the dark mode of the app.
 *
 * @param props.darkMode - boolean, true if dark mode is on
 * @param props.setDarkMode - function to set dark mode on/off
 */
const Toggle = ({ darkMode, setDarkMode }) => (
    <Switch
        checked={darkMode}
        onChange={setDarkMode}
        className={
            'relative inline-flex flex-shrink-0 h-[34px] w-[58px] border-2 dark:border-transparent border-orange-100 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 bg-orange-50 dark:bg-zinc-900'
        }
    >
        <span className='sr-only'>Use setting</span>
        <span
            aria-hidden='true'
            className={`${
                darkMode ? 'translate-x-6 bg-zinc-700' : 'translate-x-0 bg-orange-200'
            } pointer-events-none inline-block h-[30px] w-[30px]
				rounded-full shadow-lg transform ring-0 transition ease-in-out duration-200 flex justify-center items-center`}
        >
            {darkMode ? <i className='bi bi-moon-fill text-white'></i> : <i className='bi bi-sun-fill text-black'></i>}
        </span>
    </Switch>
)

/**
 * ## Navbar of the app
 * Handles the navigation and dark-mode systems
 */
export default function Navbar() {
    const router = useRouter()

    // DARK MODE
    const [darkMode, setDarkMode] = useState(false)
    const theme = darkMode ? 'dark' : 'light'

    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark') {
            setDarkMode(true)
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true)
        }
    }, [])

    useEffect(() => {
        document.body.dataset.theme = theme
        if (darkMode) {
            localStorage.setItem('theme', 'dark')
            document.documentElement.classList.add('dark')
        } else {
            localStorage.setItem('theme', 'light')
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode, theme])

    // END DARK MODE

    return (
        <Disclosure as='nav' className='bg-zinc-800 shadow dark:shadow-zinc-700'>
            {({ open }) => (
                <>
                    <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
                        <div className='relative flex items-center justify-between h-16'>
                            <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                                {/* Mobile menu button*/}
                                <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                                    <span className='sr-only'>Open main menu</span>
                                    {open ? <i className='bi bi-x-lg'></i> : <i className='bi bi-list'></i>}
                                </Disclosure.Button>
                            </div>
                            <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
                                <Link href='/' passHref>
                                    <button className='flex-shrink-0 flex items-center '>
                                        <div className='h-8 w-8 relative'>
                                            <Image src='/favicon.svg' alt='Hexastats' layout='fill' />
                                        </div>
                                        <h1 className='text-2xl text-white ml-2 hidden lg:block tracking-wider'>Hexastats</h1>
                                    </button>
                                </Link>
                                <div className='hidden sm:block sm:ml-6'>
                                    <div className='flex space-x-4'>
                                        <RenderLinks navigation={navigation} router={router} />
                                    </div>
                                </div>
                            </div>
                            <div className='absolute right-0 flex'>
                                <Toggle darkMode={darkMode} setDarkMode={setDarkMode} />
                                <div className='flex items-center justify-center ml-10 hidden md:block text-white hover:text-indigo-400 text-2xl'>
                                    <a title='See project' href='https://github.com/dawichi/hexastats' target='_blank' rel='noreferrer'>
                                        <i className='bi bi-github'></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className='sm:hidden'>
                        <div className='px-2 pt-2 pb-3 space-y-1'>
                            <RenderLinks navigation={navigation} router={router} />
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}
