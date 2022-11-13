<!--
  @component
  ## Summoner component
  Player details
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { RankStructure } from '$lib/components'
    import { RiotService } from '$lib/services/Riot.service'
    import ListFriends from './ListFriends.svelte'
    import ListPositions from './ListPositions.svelte'
    import ListChamps from './ListChamps.svelte'
    import ListGames from './games/ListGames.svelte'

    export let player: SummonerDto
</script>

<div
    class="relative rounded-lg bg-cover bg-center shadow"
    style="background-image: url({RiotService.champSplash(player.masteries[0].name)})"
>
    <span class="absolute top-3 left-5">{player.games.length} games loaded</span>
    <section class="bg-orange-50/80 pb-12 dark:bg-zinc-900/80">
        <header class="py-5">
            <RankStructure player={player} />
        </header>

        <div class="grid grid-cols-3">
            <section>
                <div class="{styles.background} {styles.card} m-2 mb-4">
                    <h2 class="pt-3 text-center text-2xl">Champions</h2>
                    <div class="grid grid-cols-4 p-2 text-center">
                        <span>Champ</span>
                        <span>Games</span>
                        <span>Winrate</span>
                        <span>KDA</span>
                    </div>
                    <hr class="m-2" />
                    <ListChamps {player} />
                </div>
                <div class="{styles.background} {styles.card} m-2 mb-4">
                    <h2 class="pt-3 text-center text-2xl">
                        <i class="bi bi-bar-chart-fill" />
                        <span class="m-5">Positions</span>
                        <i class="bi bi-bar-chart-fill" />
                    </h2>
                    <hr class="m-2" />
                    <ListPositions {player} />
                </div>
                <div class="{styles.background} {styles.card} m-2 mb-4">
                    <h2 class="pt-3 text-center text-2xl">
                        <i class="bi bi-person-fill" />
                        <span class="m-5">Friends</span>
                        <i class="bi bi-person-fill" />
                    </h2>
                    <hr class="m-2" />
                    <ListFriends {player} />
                </div>
            </section>
            <section class="col-span-2">
                <ListGames {player} />
            </section>
        </div>
    </section>
</div>
