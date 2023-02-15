<!--
  @component
  ## Summoners Grid component
  Display a list of summoners who played in that game
-->
<script lang="ts">
    import type { GameDto } from '$lib/types'
    import { RiotService } from '$lib/services/Riot.service'

    export let game: GameDto
</script>

<div class="animate__animated animate__fadeIn columns-2 p-1">
    {#each game.participants as participant}
        <span class="flex items-center">
            <img class="rounded" src={RiotService.champImage(participant.champ.championName)} alt="champion" style="width: 24px; height: 24px;" />
            <span class="ml-1 h-5 w-20 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                {participant.summonerName}
            </span>
        </span>
    {/each}
</div>
