<script lang="ts">
    import { styles } from '$lib/config'
    import type { StatsDto } from '$lib/types'
    import ListChamps from './ListChamps.svelte'
    import ListFriends from './ListFriends.svelte'
    import ListPositions from './ListPositions.svelte'

    export let stats: StatsDto

    function handleMoreGames(): void {
        console.log('more games')
    }
</script>

<div class="{styles.foreground} {styles.card} relative m-2 p-4">
    <h2 class="text-2xl">Stats</h2>
    <span class="text-sm">based in {stats.gamesUsed.length} games </span>
    
    <button on:click={handleMoreGames} class="bg-indigo-500 px-2 rounded hover:bg-indigo-600 text-white absolute top-3 right-3">
        Add games
    </button>
    
    <div class="grid grid-cols-1 gap-4 mt-4">
        <!-- CHAMPION STATS -->
        <ListChamps champs={stats.statsByChamp} />

        <!-- POSITION STATS -->
        <ListPositions positions={stats.statsByPosition} />

        <!-- FRIEND STATS -->
        <ListFriends friends={stats.friends} />
    </div>
</div>
