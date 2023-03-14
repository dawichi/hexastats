<!-- Visualize the player details -->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { Container, MasteryRow, RankStructure } from '$lib/components'
    import { RiotService } from '$lib/services/Riot.service'
    import ListChamps from './ListChamps.svelte'
    import ListPositions from './ListPositions.svelte'
    import ListFriends from './ListFriends.svelte'
    import ListGames from './ListGames.svelte'
    import { playerContext } from '$lib/context/players'
    import { generateReport } from '$lib/utils/generateReport'
    import { reportsContext, type ReportDto } from '$lib/context/reports'

    /** @type {import('./$types').PageData} */
    export let data: SummonerDto

    // Context
    let _player: SummonerDto = {} as SummonerDto
    playerContext.subscribe(player => (_player = player))
    playerContext.set(data)

    // Reports
    let _reports: ReportDto[] = []
    reportsContext.subscribe(data => (_reports = data))

    let analyzed = false
    function handleGenerateReport(): void {
        analyzed = true
        reportsContext.update(reports => [...reports, generateReport(_player)])
    }
</script>

<Container title="" description="" disableHeader>
    <div class="relative rounded-lg bg-contain shadow" style="background-image: url({RiotService.champSplash(_player.masteries[0].name)})">
        <section class="bg-orange-50/80 dark:bg-zinc-900/80 md:px-4">
            <header class="flex flex-col items-center justify-around py-5 lg:flex-row">
                <RankStructure player={_player} />
                <MasteryRow masteries={_player.masteries} />
            </header>

            {#if !analyzed}
                <button
                    class="{styles.card} {styles.scale} mx-2 my-1 cursor-pointer bg-zinc-800 py-2 px-4 text-white hover:bg-indigo-600"
                    on:click={handleGenerateReport}
                >
                    Analyze
                </button>
            {:else}
                <button class="{styles.card} mx-2 my-1 cursor-pointer bg-green-700 py-2 px-4 text-white">
                    Analyzed <i class="bi bi-check" />
                </button>
            {/if}

            <div class="grid-cols-3 2xl:grid">
                <aside class="grid lg:grid-cols-2 2xl:block">
                    <div class="{styles.foreground} {styles.card} m-2 mb-4">
                        <h2 class="pt-3 text-center text-2xl">Champions</h2>
                        <div class="grid grid-cols-4 p-2 text-center">
                            <span>Champ</span>
                            <span>Games</span>
                            <span>Winrate</span>
                            <span>KDA</span>
                        </div>
                        <hr class="m-2" />
                        <ListChamps player={_player} />
                    </div>
                    <div class="flex flex-col">
                        <div class="{styles.foreground} {styles.card} m-2 mb-4">
                            <h2 class="pt-3 text-center text-2xl">Positions</h2>
                            <hr class="m-2" />
                            <ListPositions player={_player} />
                        </div>
                        <div class="{styles.foreground} {styles.card} m-2 mb-4">
                            <h2 class="pt-3 text-center text-2xl">Friends</h2>
                            <hr class="m-2" />
                            <ListFriends player={_player} />
                        </div>
                    </div>
                </aside>

                <section class="col-span-2">
                    <ListGames player={_player} />
                </section>
            </div>
        </section>
    </div>
</Container>
