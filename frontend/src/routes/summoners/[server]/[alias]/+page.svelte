<!-- Visualize the player details -->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { Container, RankStructure } from '$lib/components'
    import { RiotService } from '$lib/services/Riot.service'
    import ListChamps from './ListChamps.svelte'
    import ListPositions from './ListPositions.svelte'
    import ListFriends from './ListFriends.svelte'
    import ListGames from './games/ListGames.svelte'

    /** @type {import('./$types').PageData} */
    export let data: SummonerDto
</script>

<Container title="" description="" disableHeader>
    <div class="relative rounded-lg bg-contain shadow" style="background-image: url({RiotService.champSplash(data.masteries[0].name)})">
        <span class="absolute top-3 left-5">{data.games.length} games loaded</span>
        <section class="bg-orange-50/80 px-4 dark:bg-zinc-900/80">
            <header class="py-5">
                <RankStructure player={data} />
            </header>

            <div class="grid grid-cols-3">
                <section>
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
                </section>
                <section class="col-span-2">
                    <ListGames player={data} />
                </section>
            </div>
        </section>
    </div>
</Container>
