<!-- Visualize the player details -->
<script lang="ts">
    import type { StatsDto, SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    // components
    import { Container, MasteryRow, RankStructure } from '$lib/components'
    // services
    import { RiotService } from '$lib/services/Riot.service'
    import { playerContext } from '$lib/context/players'
    // Sub-Components
    import ListChamps from './ListChamps.svelte'
    import ListPositions from './ListPositions.svelte'
    import ListFriends from './ListFriends.svelte'
    import ListGames from './ListGames.svelte'
    import Stats from './Stats.svelte'

    /** @type {import('./$types').PageData} */
    export let data: {
        player: SummonerDto
        stats: StatsDto
    }


    const riotService = RiotService.getInstance()
</script>

<Container title="" description="" disableHeader>
    <div class="relative rounded-lg bg-contain shadow" style="background-image: url({riotService.champSplash(data.player.masteries[0].name)})">
        <section class="bg-orange-50/80 dark:bg-zinc-900/80 md:px-4">
            <header class="flex flex-col items-center justify-around py-5 lg:flex-row">
                <RankStructure player={data.player} />
                <MasteryRow masteries={data.player.masteries} />
            </header>

            <div class="grid-cols-3 lg:cols-2 2xl:grid">
                <aside class="grid 2xl:block justify-center mx-auto" style="max-width: 50vw;">
                    <Stats stats={data.stats} />
                </aside>

                <section class="col-span-2">
                    <ListGames player={data.player} />
                </section>
            </div>
        </section>
    </div>
</Container>
