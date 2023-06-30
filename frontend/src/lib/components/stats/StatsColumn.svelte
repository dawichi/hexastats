<script lang="ts">
    import type { StatsDto } from '$lib/types'
    import { styles } from '$lib/config'
    import ListFriends from './_ListFriends.svelte'
    import ListPositions from './_ListPositions.svelte'
    import ListChamps from './_ListChamps.svelte'

    export let stats: StatsDto
</script>

<div class="{styles.foreground} {styles.card} relative md:m-2 p-4">
    <div class="grid grid-cols-1 gap-4">
        <!-- CHAMPION STATS -->
        <ListChamps champs={stats.statsByChamp} />

        <!-- POSITION STATS -->
        <ListPositions positions={stats.statsByPosition} />

        <!-- FRIEND STATS -->
        <ListFriends friends={stats.friends} />
    </div>
</div>
