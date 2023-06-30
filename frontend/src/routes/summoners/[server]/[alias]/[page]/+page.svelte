<!-- Visualize the player details -->
<script lang="ts">
    import type { StatsDto, SummonerDto } from '$lib/types'
    import { Container } from '$lib/components'
    import ListGames from './ListGames.svelte'
    import Stats from './Stats.svelte'

    /** @type {import('./$types').PageData} */
    export let data: {
        player: SummonerDto
        stats: StatsDto
    }
</script>

<ListGames player={data.player} />
