<!-- Visualize the player details -->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { Container, MasteryRow, MockGame, RankStructure } from '$lib/components'
    import { RiotService } from '$lib/services/Riot.service'
    import ListChamps from './ListChamps.svelte'
    import ListPositions from './ListPositions.svelte'
    import ListFriends from './ListFriends.svelte'
    import ListGames from './games/ListGames.svelte'
    import { SummonerService } from '$lib/services/Summoner.service'

    /** @type {import('./$types').PageData} */
    export let data: SummonerDto

    // Load games logic
    let loadingGames: boolean = false

    async function loadMoreGames(): Promise<void> {
        loadingGames = true
        try {
            const newGames = await SummonerService.addGames(data.server, data.alias)
            data.games = [...data.games, ...newGames]
        } catch (error) {
            console.error(error)
        }
        loadingGames = false
    }
</script>

<Container title="" description="" disableHeader>
    <div class="relative rounded-lg bg-contain shadow" style="background-image: url({RiotService.champSplash(data.masteries[0].name)})">
        <section class="bg-orange-50/80 dark:bg-zinc-900/80 md:px-4">
            <header class="flex flex-col items-center justify-around py-5 lg:flex-row">
                <RankStructure player={data} />
                <MasteryRow masteries={data.masteries} />
            </header>

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
                        <ListChamps player={data} />
                    </div>
                    <div class="flex flex-col">
                        <div class="{styles.foreground} {styles.card} m-2 mb-4">
                            <h2 class="pt-3 text-center text-2xl">Positions</h2>
                            <hr class="m-2" />
                            <ListPositions player={data} />
                        </div>
                        <div class="{styles.foreground} {styles.card} m-2 mb-4">
                            <h2 class="pt-3 text-center text-2xl">Friends</h2>
                            <hr class="m-2" />
                            <ListFriends player={data} />
                        </div>
                    </div>
                </aside>

                <section class="col-span-2">
                    <ListGames player={data} />

                    {#if data.games.length < 50}
                        <div class="flex justify-center">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            {#if !loadingGames}
                                <button
                                    on:click={loadMoreGames}
                                    class="{styles.card} {styles.scale} mx-4 my-2 cursor-pointer bg-indigo-600 p-3 px-6 text-white"
                                >
                                    <i class="bi bi-cloud-download mr-2" /> Load 10 more games
                                </button>
                            {:else}
                                <MockGame />
                            {/if}
                        </div>
                    {:else}
                        <p class="p-4 text-center text-lg"><i class="bi bi-exclamation-circle" /> Currently limited to 50 games loaded</p>
                    {/if}
                </section>
            </div>
        </section>
    </div>
</Container>
