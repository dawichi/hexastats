<!--
  @component
  ## Navbar component
  Display the menu, the dark-mode toggle and the logo
-->
<script lang="ts">
    import { navigation } from '$lib/config/navigation'
    import { Navbar, NavBrand, NavHamburger, NavUl } from 'flowbite-svelte'
    import DarkToggle from './DarkToggle.svelte'
</script>

<Navbar let:hidden let:toggle navClass="bg-zinc-800 shadow dark:shadow-zinc-700" id="fsdfsdfsdf">
    <NavBrand href="/">
        <img src="/favicon.ico" class="mr-3 h-6 sm:h-9" alt="Logo" />
        <h1 class='text-2xl text-white ml-2 hidden lg:block tracking-wider'>Hexastats</h1>
    </NavBrand>

    <NavHamburger on:click={toggle} />

    <NavUl {hidden}>
        {#each navigation as item}
            <a
                href={item.path}
                class={'block px-3 py-2 rounded-md text-base font-medium ' +
                    (false ? 'bg-zinc-900 text-white' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white')}
            >
                {item.name}
            </a>
        {/each}
        <div class='flex'>
            <DarkToggle />
            <div class='flex items-center justify-center ml-10 hidden md:block text-white hover:text-indigo-400 text-2xl'>
                <a title='See project' href='https://github.com/dawichi/hexastats' target='_blank' rel='noreferrer'>
                    <i class='bi bi-github'></i>
                </a>
            </div>
        </div>
    </NavUl>
</Navbar>

<!-- 
/**
 * ## Navbar of the app
 * Handles the navigation and dark-mode systems
 */
export default function Navbar() {
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
} -->
