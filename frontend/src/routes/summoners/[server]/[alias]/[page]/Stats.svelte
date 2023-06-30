<script lang="ts">
    import type { StatsDto } from '$lib/types'
    import { page } from '$app/stores'
    import { styles } from '$lib/config'
    import { SummonerService } from '$lib/services/Summoner.service'
    import { ListChamps } from '$lib/components'
    import ListFriends from './ListFriends.svelte'
    import ListPositions from './ListPositions.svelte'

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
