<!--
  @component
  ## DarkToggle component
  A toggle to control the dark mode of the app.
-->
<script lang="ts">
    import { generalContext, type GeneralContextDto } from '$lib/context/general'
    import { classNames } from '$lib/utils'
    import { onMount } from 'svelte'

    let _general: GeneralContextDto
    generalContext.subscribe(value => (_general = value))

    // Load preferred color scheme
    onMount(() => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || localStorage.getItem('theme') === 'dark'
        if (prefersDarkMode) {
            toggleDarkMode()
        }
    })

    function toggleDarkMode() {
        const newMode = _general.darkMode ? 'light' : 'dark'
        document.body.dataset.theme = newMode
        localStorage.setItem('theme', newMode)
        document.documentElement.classList.toggle('dark')

        generalContext.update(v => ({ ...v, darkMode: !_general.darkMode }))
    }
</script>

<button class="h-[34px] w-[58px] cursor-pointer rounded-full bg-orange-50 focus:outline-none dark:bg-zinc-900" on:click={toggleDarkMode}>
    <span
        class={classNames(
            `${_general.darkMode ? 'translate-x-[25px] bg-zinc-700' : 'translate-x-[2px] bg-orange-200'} pointer-events-none inline-block`,
            ' h-[30px] w-[30px] rounded-full transform ring-0 transition ease-in-out duration-700 flex justify-center items-center',
        )}
    >
        {#if _general.darkMode}
            <i class="bi bi-moon-fill text-white animate__animated animate__rotateIn" />
        {:else}
            <i class="bi bi-sun-fill text-black animate__animated animate__rotateInUpRight" />
        {/if}
    </span>
</button>

