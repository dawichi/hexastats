<script lang="ts">
    import type { StatsDto } from '$lib/types'
    import { page } from '$app/stores'
    import { styles } from '$lib/config'
    import { SummonerService } from '$lib/services/Summoner.service'
    import ListChamps from './ListChamps.svelte'
    import ListFriends from './ListFriends.svelte'
    import ListPositions from './ListPositions.svelte'

    export let stats: StatsDto

    let loading = false

    const [x, y, server, summoner, page_num] = $page.url.pathname.split('/')

    async function handleMoreGames() {
        // Prevent multiple requests
        if (loading) return

        loading = true
        stats = await SummonerService.addStats(server, `${decodeURI(summoner)}`)
        loading = false
    }
</script>

<div class="{styles.foreground} {styles.card} relative m-2 p-4">
    <h2 class="text-2xl">Stats</h2>
    <span class="text-sm">based in {stats.gamesUsed.length} games </span>

    <button on:click={handleMoreGames} class="absolute top-3 right-3 rounded bg-indigo-500 px-2 text-sm text-white hover:bg-indigo-600">
        {#if loading}
            <i class="bi bi-arrow-clockwise animate block animate-spin" />
        {:else}
            Add +10 games
        {/if}
    </button>

    <div class="mt-4 grid grid-cols-1 gap-4">
        <!-- CHAMPION STATS -->
        <ListChamps champs={stats.statsByChamp} />

        <!-- POSITION STATS -->
        <ListPositions positions={stats.statsByPosition} />

        <!-- FRIEND STATS -->
        <ListFriends friends={stats.friends} />
    </div>
</div>
