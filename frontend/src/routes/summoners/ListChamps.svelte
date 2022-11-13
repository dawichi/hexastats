<!--
  @component
  ## List Champs component
  Display a list of champions with their stats
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { ChampService } from '$lib/services/Champ.service'
    import { RiotService } from '$lib/services/Riot.service'

    export let player: SummonerDto

    const maxGames = () => Math.max(...ChampService.champsBuilder(player.games).map(champ => champ.games))
    const maxWinrate = () => Math.max(...ChampService.champsBuilder(player.games).map(champ => champ.winrate))
    const maxKDA = () => Math.max(...ChampService.champsBuilder(player.games).map(champ => champ.kda))
</script>

{#each ChampService.champsBuilder(player.games) as champ}
    <div class="grid grid-cols-4 px-4 py-1">
        <div class="flex justify-center">
            <img class="w-12 rounded" src={RiotService.champImage(champ.name)} alt="champion" />
        </div>

        <div class="w-full px-2">
            <span class="">{champ.games}</span>
            <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                <div class="h-2 rounded bg-blue-400" style="width: {(champ.games / maxGames()) * 100}%" />
            </div>
        </div>

        <div class="w-full px-2">
            <span class="">{champ.winrate}%</span>
            <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                <div class="h-2 rounded bg-red-400" style="width: {(champ.winrate / maxWinrate()) * 100}%" />
            </div>
        </div>

        <div class="w-full px-2">
            <span class="">{champ.kda}</span>
            <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                <div class="h-2 rounded bg-green-400" style="width: {(champ.kda / maxKDA()) * 100}%" />
            </div>
        </div>
    </div>
{/each}
