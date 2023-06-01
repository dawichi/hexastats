<!--
  @component
  ## List Champs component
  Display a list of champions with their stats
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { ChampService } from '$lib/services/Champ.service'
    import { RiotService } from '$lib/services/Riot.service'
    import { filteredGamesContext } from '$lib/context/players'

    export let player: SummonerDto

    // Context
    let _activeFilter = ''
    filteredGamesContext.subscribe(data => (_activeFilter = data.activeFilter))

    const riotService = RiotService.getInstance()

    const maxGames = () => Math.max(...ChampService.champsBuilder(player.games).map(champ => champ.games))
    const maxKDA = () => Math.max(...ChampService.champsBuilder(player.games).map(champ => champ.kda))

    function handleClick(championName: string) {
        if (championName === _activeFilter) return filteredGamesContext.update(data => ({ activeFilter: '', games: player.games }))
        filteredGamesContext.update(data => ({
            activeFilter: championName,
            games: player.games.filter(game => game.participants[game.participantNumber].championName === championName),
        }))
    }
</script>

{#each ChampService.champsBuilder(player.games) as champ}
    <div class="grid grid-cols-4 px-4">
        <div class="flex justify-center">
            <button on:click={() => handleClick(champ.name)} class="p-1 {champ.name === _activeFilter ? 'rounded-sm bg-yellow-400 transition-transform scale-110' : 'transition-transform hover:scale-125'}">
                <img class="w-12 rounded" src={riotService.champImage(champ.name)} alt="champion" />
            </button>
        </div>

        <div class="w-full px-2">
            <span class="flex justify-center">{champ.games}</span>
            <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                <div class="h-2 rounded bg-blue-400" style="width: {(champ.games / maxGames()) * 100}%" />
            </div>
        </div>

        <div class="w-full px-2">
            <span class="flex justify-center">{champ.winrate}%</span>
            <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                <div class="h-2 rounded bg-red-400" style="width: {champ.winrate}%" />
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
