<!--
  @component
  ## List Games component
  List all games from a player
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import Game from './Game.svelte'
    import { styles } from '$lib/config'

    export let player: SummonerDto

    // Utils
    let filteredGames = player.games
    let activeFilter = ''
    const gameModes = [...new Set(player.games.map(game => game.gameMode))]
    const champsPlayed = [...new Set(player.games.map(game => game.participants[game.participantNumber].champ.championName))]

    function filterBy(gameMode: string) {
        if (activeFilter === gameMode) {
            filteredGames = player.games
            activeFilter = ''
            return
        }
        activeFilter = gameMode
        filteredGames = player.games.filter(game => game.gameMode === gameMode)
    }
</script>

<div>
    {#each gameModes as gameMode}
        <button
            on:click={() => filterBy(gameMode)}
            class="{styles.card} {styles.scale} mx-4 my-2 cursor-pointer {activeFilter === gameMode ? 'bg-indigo-900' : 'bg-indigo-600'} p-3 px-6 text-white"
            >{gameMode}</button
        >
    {/each}

    <div class="grid gap-2">
        {#each filteredGames as game}
            <Game {game} participant={game.participants[game.participantNumber]} />
        {/each}
    </div>
</div>
