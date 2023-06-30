<!-- Visualize the player details -->
<script lang="ts">
    import type { MasteryDto, RankDataDto, StatsDto } from '$lib/types'
    import { navigating } from '$app/stores'
    import { ChampStats, Container, MasteryRow, RankStructure, Spinner } from '$lib/components'
    import { RiotService } from '$lib/services/Riot.service'
    import Stats from './[page]/Stats.svelte'
    import RecordCard from './RecordCard.svelte'
    import { SummonerService } from '$lib/services/Summoner.service'

    /** @type {import('./$types').LayoutData} */
    export let data: {
        player: RankDataDto
        masteries: Array<MasteryDto>
        stats: StatsDto
    }

    let tabSelected: 'games' | 'champions' | 'records' = 'games'
    let loading = false

    const tabClass = "bg-indigo-400 hover:bg-indigo-800 text-white py-2 rounded-t-lg transition"

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

<Container title="" description="" disableHeader>
    <div class="relative rounded-lg bg-contain shadow" style="background-image: url({riotService.champSplash(data.masteries[0].name)})">
        <section class="bg-orange-50/80 dark:bg-zinc-900/80 md:px-4">
            <header class="flex flex-col items-center justify-around py-5 lg:flex-row">
                <RankStructure player={data.player} />
                <MasteryRow masteries={data.masteries} />
            </header>
        </section>
    </div>

    <div class="grid-cols-3 lg:cols-2 2xl:grid py-8">
        <aside class="grid 2xl:block justify-center mx-auto">
            <div class="flex justify justify-between px-2">
                <div>
                    <h2 class="text-2xl">Stats</h2>
                    <span class="text-sm">based in last {data.stats.gamesUsed.length} games</span>
                </div>
    
                <button on:click={handleMoreGames} class="block rounded bg-indigo-500 mt-2 px-2 text-white hover:bg-indigo-600 w-40">
                    {#if loading}
                        <i class="bi bi-arrow-clockwise animate block animate-spin" />
                    {:else}
                        ADD 10 GAMES
                    {/if}
                </button>
            </div>
            <Stats stats={data.stats} />
        </aside>
    
        <!-- TABS -->
        <section class="col-span-2">
            <div class="grid grid-cols-3 gap-4 border-b-8 border-b-indigo-800">
                <button on:click={() => tabSelected = 'games'} class="{tabClass} {tabSelected === 'games' ? 'bg-indigo-800 scale-y-120' : ''}">Games list</button>
                <button on:click={() => tabSelected = 'champions'} class="{tabClass} {tabSelected === 'champions' ? 'bg-indigo-800' : ''}">Champion stats</button>
                <button on:click={() => tabSelected = 'records'} class="{tabClass} {tabSelected === 'records' ? 'bg-indigo-800' : ''}">Records</button>
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
                <div class="grid grid-cols-4 gap-4 p-2">
                    <RecordCard data={data.stats.records.kda} title="KDA" />
                    <RecordCard data={data.stats.records.kills} title="Kills" />
                    <RecordCard data={data.stats.records.deaths} title="Deaths" />
                    <RecordCard data={data.stats.records.assists} title="Assists" />
                    <RecordCard data={data.stats.records.gold} title="Gold" />
                    <RecordCard data={data.stats.records.goldPerMin} title="Gold/min" />
                    <RecordCard data={data.stats.records.cs} title="CS" />
                    <RecordCard data={data.stats.records.csPerMin} title="CS/min" />
                    <RecordCard data={data.stats.records.vision} title="Vision" />
                    <RecordCard data={data.stats.records.visionPerMin} title="Vision/min" />
                    <RecordCard data={data.stats.records.gameDuration} title="game duration" />
                    <RecordCard data={data.stats.records.doubleKills} title="x2" />
                    <RecordCard data={data.stats.records.tripleKills} title="x3" />
                    <RecordCard data={data.stats.records.quadraKills} title="x4" />
                    <RecordCard data={data.stats.records.pentaKills} title="x5" />
                </div>
            {/if}
        </section>
    </div>
</Container>

