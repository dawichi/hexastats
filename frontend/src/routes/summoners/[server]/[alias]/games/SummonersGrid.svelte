<!--
  @component
  ## Summoners Grid component
  Display a list of summoners who played in that game
-->
<script lang="ts">
    import type { GameDto } from '$lib/types'
    import { RiotService } from '$lib/services/Riot.service'
    import { rawServer, styles } from '$lib/config'

    export let game: GameDto
    export let server: string
</script>

<div class="animate__animated animate__fadeIn columns-2 p-1">
    {#each game.participants as participant, idx}
        <span class="flex items-center">
            <img class="{styles.iconSize.medium} rounded" src={RiotService.champImage(participant.champ.championName)} alt="champion" />
            <span class="ml-1 h-5 w-20 overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm">
                <a
                    href={`/summoners/${rawServer(server)}/${participant.summonerName}`}
                    class="hover:underline {game.participantNumber === idx ? 'font-bold' : ''}"
                >
                    {participant.summonerName}
                </a>
            </span>
        </span>
    {/each}
</div>
