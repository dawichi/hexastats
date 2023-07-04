<!-- Visualize the player details -->
<script lang="ts">
    import type { MasteryDto, RankDataDto, StatsDto } from '$lib/types'
    import { navigating } from '$app/stores'
    import { Button, ChampStats, Container, MasteryRow, ModalGame, RankStructure, Records, Spinner, StatsColumn } from '$lib/components'
    import { RiotService } from '$lib/services/Riot.service'
    import { SummonerService } from '$lib/services/Summoner.service'

    /** @type {import('./$types').LayoutData} */
    export let data: {
        player: RankDataDto
        masteries: Array<MasteryDto>
        stats: StatsDto
    }

    let tabSelected: 'games' | 'champions' | 'records' = 'games'
    let loading = false

    const tabClass = 'bg-zinc-400 hover:bg-zinc-700 text-white py-2 rounded-t-lg transition'

    const riotService = RiotService.getInstance()
    const summonerService = SummonerService.getInstance()

    async function handleMoreGames() {
        // Prevent multiple requests
        if (loading) return

        loading = true
        data.stats = await summonerService.addStats(data.player.server, `${data.player.alias}`)
        loading = false
    }
</script>

<ModalGame />

<Container title="" description="" disableHeader>
    <!-- HEADER BLOCK: RANK & MASTERIES -->
    <section class="relative rounded-lg bg-contain shadow" style="background-image: url({riotService.champSplash(data.masteries[0].name)})">
        <div class="bg-orange-50/80 dark:bg-zinc-900/80 md:px-4">
            <header class="flex flex-col items-center justify-around gap-y-4 py-5 lg:flex-row">
                <RankStructure player={data.player} />
                <MasteryRow masteries={data.masteries} />
            </header>
        </div>
    </section>

    <!-- MAIN BLOCK UNDER IT -->
    <div class="grid-cols-3 py-8 2xl:grid">
        <aside class="mx-auto grid justify-center 2xl:block pb-16">
            <div class="justify flex justify-between p-2">
                <div>
                    <h2 class="text-2xl">{data.player.alias}'s Stats</h2>
                    <span class="text-sm">based in last {data.stats.gamesUsed.length} games</span>
                </div>

                <Button onClick={handleMoreGames} isLoading={loading}>ADD 10 GAMES</Button>
            </div>
            <StatsColumn stats={data.stats} />
        </aside>

        <!-- TABS -->
        <section class="col-span-2">
            <div class="mb-2 grid grid-cols-3 gap-4 border-b-8 border-b-zinc-800">
                <button on:click={() => (tabSelected = 'games')} class="{tabClass} {tabSelected === 'games' ? 'scale-y-120 bg-zinc-800' : ''}"
                    >Games list</button
                >
                <button on:click={() => (tabSelected = 'champions')} class="{tabClass} {tabSelected === 'champions' ? 'bg-zinc-800' : ''}"
                    >Champion stats</button
                >
                <button on:click={() => (tabSelected = 'records')} class="{tabClass} {tabSelected === 'records' ? 'bg-zinc-800' : ''}">Records</button>
            </div>

            <!-- TAB 1 -->
            {#if tabSelected === 'games'}
                {#if $navigating}
                    {#if $navigating?.to?.url.pathname.includes('summoners')}
                        <Spinner />
                        <h1 class="text-center text-2xl">Getting games...<br /> {decodeURI($navigating?.to?.url.pathname.split('/')[3])}</h1>
                    {/if}
                {:else}
                    <slot />
                {/if}
            {/if}

            <!-- TAB 2 -->
            {#if tabSelected === 'champions'}
                <ChampStats stats={data.stats} />
            {/if}

            <!-- TAB 3 -->
            {#if tabSelected === 'records'}
                <Records player={data.player} stats={data.stats} />
            {/if}
        </section>
    </div>
</Container>
