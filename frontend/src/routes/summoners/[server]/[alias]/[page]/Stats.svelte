<script lang="ts">
    import type { StatsDto } from '$lib/types'
    import { page } from '$app/stores'
    import { styles } from '$lib/config'
    import { SummonerService } from '$lib/services/Summoner.service'
    import { ListChamps } from '$lib/components'
    import ListFriends from './ListFriends.svelte'
    import ListPositions from './ListPositions.svelte'

    export let stats: StatsDto

    let loading = false

    const [x, y, server, alias, page_num] = $page.url.pathname.split('/')
    const summonerService = SummonerService.getInstance()

    async function handleMoreGames() {
        // Prevent multiple requests
        if (loading) return

        loading = true
        stats = await summonerService.addStats(server, `${decodeURI(alias)}`)
        loading = false
    }
</script>

<div class="{styles.foreground} {styles.card} relative md:m-2 p-4">
    <h2 class="text-2xl">Stats</h2>
    <span class="text-sm">based in {stats.gamesUsed.length} games </span>

    <div>
        <a href="/summoners/{server}/{alias}/stats" class="absolute top-3 right-3 rounded bg-indigo-500 px-2 text-white hover:bg-indigo-600">
            SEE MORE STATS <i class="bi bi-bar-chart-fill"></i>
        </a>
    </div>

    <button on:click={handleMoreGames} class="block rounded bg-indigo-500 px-2 text-white hover:bg-indigo-600">
        {#if loading}
            <i class="bi bi-arrow-clockwise animate block animate-spin" />
        {:else}
            ADD +10
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
