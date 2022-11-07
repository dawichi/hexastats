<script lang="ts">
    import '../app.css'
    import { styles } from '$lib/config/styles'
    import { Footer, ListPlayersHeader, Navbar } from '$lib/components'
    import { onMount } from 'svelte'
    import type { SummonerDto } from '$lib/types'
    import { playersContext } from '$lib/context/players'

    // Context
    let _players: SummonerDto[] = []
    playersContext.subscribe(players => (_players = players))

    onMount(() => {
        // Check if there are players stored in localStorage
        const players_stored = localStorage.getItem('players')
        
        if (players_stored) {
            playersContext.update(x => JSON.parse(players_stored))
        }
    })
</script>

<header>
    <Navbar />
</header>

<main class={`pb-20 dark:text-white min-h-screen ${styles.background}`}>
    <ListPlayersHeader />
    <slot />
</main>

<Footer />

<style>
    header {
        position: sticky;
        top: 0;
        z-index: 1;
    }
</style>
