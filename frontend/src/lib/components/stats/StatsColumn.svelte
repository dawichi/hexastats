<script lang="ts">
    import type { StatsDto } from '$lib/types'
    import { styles } from '$lib/config'
    import ListFriends from './_ListFriends.svelte'
    import ListPositions from './_ListPositions.svelte'
    import ListChamps from './_ListChamps.svelte'
    import SearchPlayer from '../logic/SearchPlayer.svelte'

    export let stats: StatsDto

    let shouldAutofocus = false
</script>

<div class="{styles.foreground} {styles.card} relative p-4 md:m-2">
    <div class="grid grid-cols-1 gap-4">
        <!-- CHAMPION STATS -->
        <ListChamps champs={stats.statsByChamp} />

        <!-- POSITION STATS -->
        <ListPositions positions={stats.statsByPosition} />

        <!-- FRIEND STATS -->
        <ListFriends friends={stats.friends} />
    </div>
</div>

<div>
    <SearchPlayer autofocus={shouldAutofocus} />
</div>
