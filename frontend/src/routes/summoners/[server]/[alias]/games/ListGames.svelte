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
    const champsPlayed = [...new Set(player.games.map(game => game.participants[game.participantNumber].champ.championName))]
    const getGameModes = (player: SummonerDto) => [...new Set(player.games.map(game => game.gameMode))]

    function getNumGamesByMode(gameMode: string, player: SummonerDto): number {
        const gameModeCounts: Record<string, number> = {}
        for (const gameMode of getGameModes(player)) {
            gameModeCounts[gameMode] = player.games.filter(game => game.gameMode === gameMode).length
        }
        return gameModeCounts[gameMode]
    }

    function getGames(player: SummonerDto) {
        filteredGames = player.games
        return filteredGames
    }

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
    {#each getGameModes(player) as gameMode}
        <button
            on:click={() => filterBy(gameMode)}
            class="{styles.card} {styles.scale} mx-4 my-2 cursor-pointer {activeFilter === gameMode ? 'bg-indigo-900' : 'bg-indigo-600'} p-3 px-6 text-white"
            >{gameMode} ({getNumGamesByMode(gameMode, player)})</button
        >
    {/each}

    <div class="flex items-center justify-center gap-2 px-4">
        <hr class="w-full" />
        <span class="whitespace-nowrap">
            Games loaded: {player.games.length}
        </span>
        <hr class="w-full" />
    </div>

    <div class="grid gap-2">
        {#each getGames(player) as game}
            <Game {game} participant={game.participants[game.participantNumber]} />
        {/each}
    </div>

    <div class="flex items-center justify-center gap-2 px-4">
        <hr class="w-full" />
        <span class="whitespace-nowrap">
            Games loaded: {player.games.length}
        </span>
        <hr class="w-full" />
    </div>
</div>
