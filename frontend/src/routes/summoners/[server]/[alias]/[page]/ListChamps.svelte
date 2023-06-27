<!--
  @component
  ## List Champs component
  Display a list of champions with their stats
-->
<script lang="ts">
    import type { ChampStatsDto } from '$lib/types'
    import { RiotService } from '$lib/services/Riot.service'
    import { filteredGamesContext } from '$lib/context/players'
    import { winrate } from '$lib/utils'

    export let champs: Array<ChampStatsDto>

    // Context
    let _activeFilter = ''
    filteredGamesContext.subscribe(data => (_activeFilter = data.activeFilter))

    const riotService = RiotService.getInstance()

    const maxGames = () => Math.max(...champs.map(champ => champ.games))
    const maxKDA = () => Math.max(...champs.map(champ => champ.kda))

    // function handleClick(championName: string) {
    //     if (championName === _activeFilter) return filteredGamesContext.update(data => ({ activeFilter: '', games: player.games }))
    //     filteredGamesContext.update(data => ({
    //         activeFilter: championName,
    //         games: player.games.filter(game => game.participants[game.participantNumber].championName === championName),
    //     }))
    // }
</script>

<div>
    <h2 class="pt-3 text-center text-2xl">Champions</h2>
    <hr class="m-2" />
    <div class="grid grid-cols-4 p-2 text-center">
        <span>Champ</span>
        <span>Games</span>
        <span>Winrate</span>
        <span>KDA</span>
    </div>
    {#each champs.sort((a, b) => b.games - a.games).slice(0, 7) as champ}
        <div class="grid grid-cols-4 px-4">
            <div class="flex justify-center">
                <button class="p-1 transition-transform hover:scale-125">
                    <img class="w-12 rounded" src={riotService.champImage(champ.championName)} alt="champion" />
                </button>
            </div>

            <div class="w-full px-2">
                <span class="flex justify-center">{champ.games}</span>
                <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                    <div class="h-2 rounded bg-blue-400" style="width: {(champ.games / maxGames()) * 100}%" />
                </div>
            </div>

            <div class="w-full px-2">
                <span class="flex justify-center">{winrate(champ.wins, champ.games - champ.wins)}%</span>
                <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                    <div class="h-2 rounded bg-red-400" style="width: {winrate(champ.wins, champ.games - champ.wins)}%" />
                </div>
            </div>

            <div class="w-full px-2">
                <span class="flex justify-center">{champ.kda}</span>
                <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                    <div class="h-2 rounded bg-green-400" style="width: {(champ.kda / maxKDA()) * 100}%" />
                </div>
            </div>
        </div>
    {/each}
</div>
