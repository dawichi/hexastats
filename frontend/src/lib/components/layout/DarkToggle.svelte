<!--
  @component
  ## DarkToggle component
  A toggle to control the dark mode of the app.
-->
<script lang="ts">
    import { darkModeContext } from '$lib/context/general'
    import { classNames } from '$lib/utils'
    import { onMount } from 'svelte'

    // Load preferred color scheme
    onMount(() => {
        // 1. Check if the user has a preference for this website (localStorage)
        if (localStorage.getItem('theme')) {
            console.log(`${localStorage.getItem('theme')} mode selected on localStorage`)
            return localStorage.getItem('theme') === 'dark' ? toggleDarkMode() : null
        }

        // 2. Check if the user has a preference for the system (OS)
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            console.log('dark mode selected on OS')
            toggleDarkMode()
        }
    })

    function toggleDarkMode() {
        const newMode = $darkModeContext ? 'light' : 'dark'
        document.body.dataset.theme = newMode
        localStorage.setItem('theme', newMode)
        document.documentElement.classList.toggle('dark')
        darkModeContext.set(!$darkModeContext)
    }
</script>

<button class="h-[34px] w-[58px] cursor-pointer rounded-full bg-orange-50 focus:outline-none dark:bg-zinc-900" on:click={toggleDarkMode}>
    <span
        class={classNames(
            `${$darkModeContext ? 'translate-x-[25px] bg-zinc-700' : 'translate-x-[2px] bg-orange-200'} pointer-events-none inline-block`,
            ' h-[30px] w-[30px] rounded-full transform ring-0 transition ease-in-out duration-700 flex justify-center items-center',
        )}
    >
        {#if $darkModeContext}
            <i class="bi bi-moon-fill text-white animate__animated animate__rotateIn" />
        {:else}
            <i class="bi bi-sun-fill text-black animate__animated animate__rotateInUpRight" />
        {/if}
    </span>
</button>

