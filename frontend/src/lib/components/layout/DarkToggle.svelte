<!--
  @component
  ## DarkToggle component
  A toggle to control the dark mode of the app.
-->
<script lang="ts">
    import { generalContext, type GeneralContextDto } from '$lib/context/general'
    import { Toggle } from 'flowbite-svelte'
    import { onMount } from 'svelte'

    let _general: GeneralContextDto
    generalContext.subscribe(value => (_general = value))

    onMount(() => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || localStorage.getItem('theme') === 'dark'
        generalContext.update(v => ({ ...v, darkMode: prefersDarkMode }))
    })

    function handleDarkToggle() {
        const newMode = _general.darkMode ? 'light' : 'dark'
        document.body.dataset.theme = newMode
        localStorage.setItem('theme', newMode)

        if (newMode === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        generalContext.update(v => ({ ...v, darkMode: !_general.darkMode }))
    }
</script>

<Toggle color="purple" checked={_general.darkMode} on:click={handleDarkToggle} />

<!-- 
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
-->
