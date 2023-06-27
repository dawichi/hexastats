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

<Container title="" description="" disableHeader>
    <div class="grid-cols-3 lg:cols-2 2xl:grid">
        <aside class="grid 2xl:block justify-center mx-auto">
            <Stats stats={data.stats} />
        </aside>

        <section class="col-span-2">
            <ListGames player={data.player} />
        </section>
    </div>
</Container>
