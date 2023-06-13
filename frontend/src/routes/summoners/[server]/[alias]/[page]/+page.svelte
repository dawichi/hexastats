<!-- Visualize the player details -->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    // components
    import { Container, MasteryRow, RankStructure } from '$lib/components'
    // services
    import { RiotService } from '$lib/services/Riot.service'
    import { playerContext } from '$lib/context/players'
    // Sub-Components
    import ListChamps from '../ListChamps.svelte'
    import ListPositions from '../ListPositions.svelte'
    import ListFriends from '../ListFriends.svelte'
    import ListGames from '../ListGames.svelte'

    /** @type {import('./$types').PageData} */
    export let data: SummonerDto

    // Context
    let _player: SummonerDto = {} as SummonerDto
    playerContext.subscribe(player => (_player = player))
    playerContext.set(data)

    const riotService = RiotService.getInstance()
</script>

<Container title="" description="" disableHeader>
    <div class="relative rounded-lg bg-contain shadow" style="background-image: url({riotService.champSplash(_player.masteries[0].name)})">
        <section class="bg-orange-50/80 dark:bg-zinc-900/80 md:px-4">
            <header class="flex flex-col items-center justify-around py-5 lg:flex-row">
                <RankStructure player={_player} />
                <MasteryRow masteries={_player.masteries} />
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
