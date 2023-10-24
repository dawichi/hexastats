<!--
  @component
  ## Navbar component
  Display the menu, the dark-mode toggle and the logo
-->
<script lang="ts">
    import { navigation } from '$lib/config/navigation'
    import DarkToggle from './DarkToggle.svelte'

    let menuOpen: boolean = false

    // TODO: Svelte router, highlight active link
</script>

<nav class="bg-zinc-800 text-white shadow shadow-zinc-700 dark:bg-gray-900 dark:shadow-zinc-700">
    <div class="mx-auto flex h-20 items-center justify-between px-4 lg:container">
        <a href="/" class="hidden items-center lg:flex">
            <img src="/favicon.svg" class="mr-3 h-9" alt="Logo" />
            <h1 class="ml-2 justify-between text-2xl tracking-wider">Hexastats</h1>
        </a>

        <!-- <NavHamburger on:click={toggleMenu} /> -->
        <button class="block text-4xl lg:hidden" on:click={() => (menuOpen = !menuOpen)}>
            <i class="bi bi-list" />
        </button>

        <img src="/favicon.svg" class="mr-3 block h-9 lg:hidden" alt="Logo" />

        <ul class="hidden flex-row justify-between space-x-4 p-4 lg:flex xl:space-x-8">
            {#each navigation as item}
                <a
                    href={item.path}
                    class="block rounded-md px-3 py-2 text-base font-medium {false
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}"
                >
                    {item.name}
                </a>
            {/each}
        </ul>

        <div class="flex items-center">
            <DarkToggle />
            <div class="ml-10 hidden items-center justify-center text-2xl hover:text-indigo-400 lg:flex">
                <a title="See project" href="https://github.com/dawichi/hexastats" target="_blank" rel="noreferrer">
                    <i class="bi bi-github" />
                </a>
            </div>
        </div>
    </div>

    <div class="block transition lg:hidden {menuOpen ? 'h-32 border-t' : 'h-0'} overflow-hidden">
        <ul class="grid grid-cols-2">
            {#each navigation as item}
                <a
                    href={item.path}
                    on:click={() => (menuOpen = false)}
                    class="block rounded-md px-3 py-2 text-base font-medium {false
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}"
                >
                    {item.name}
                </a>
            {/each}
        </ul>
    </div>
</nav>

<style>
    .transition,
    ul,
    a {
        transition: height 0.3s ease-in-out;
    }
</style>
