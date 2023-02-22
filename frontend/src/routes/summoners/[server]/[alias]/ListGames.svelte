<!--
  @component
  ## List Games component
  List all games from a player
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import Game from './games/Game.svelte'
    import { styles } from '$lib/config'
    import { MockGame } from '$lib/components'
    import { SummonerService } from '$lib/services/Summoner.service'
    import { playerContext } from '$lib/context/players'

    export let player: SummonerDto

    // Utils
    let filteredGames = player.games
    let activeFilter = ''
    // const champsPlayed = [...new Set(player.games.map(game => game.participants[game.participantNumber].champ.championName))]

    const getGameModes = (player: SummonerDto) => [...new Set(player.games.map(game => game.gameMode))]

    function getNumGamesByMode(gameMode: string, player: SummonerDto): number {
        const gameModeCounts: Record<string, number> = {}
        for (const gameMode of getGameModes(player)) {
            gameModeCounts[gameMode] = player.games.filter(game => game.gameMode === gameMode).length
        }
        return gameModeCounts[gameMode]
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

    // Load games logic
    let loadingGames: boolean = false

    async function loadMoreGames(): Promise<void> {
        loadingGames = true
        try {
            const newGames = await SummonerService.addGames(player.server, player.alias)
            filteredGames = [...filteredGames, ...newGames]
            playerContext.update(player => ({ ...player, games: [...player.games, ...newGames] }))
        } catch (error) {
            console.error(error)
        }
        activeFilter = ''
        loadingGames = false
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
        {#each filteredGames as game}
            <Game {game} participant={game.participants[game.participantNumber]} server={player.server} />
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

{#if player.games.length < 50}
    <div class="flex justify-center">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        {#if !loadingGames}
            <button on:click={loadMoreGames} class="{styles.card} {styles.scale} mx-4 my-2 cursor-pointer bg-indigo-600 p-3 px-6 text-white">
                <i class="bi bi-cloud-download mr-2" /> Load 10 more games
            </button>
        {:else}
            <MockGame />
        {/if}
    </div>
{:else}
    <p class="p-4 text-center text-lg"><i class="bi bi-exclamation-circle" /> Currently limited to 50 games loaded</p>
{/if}
