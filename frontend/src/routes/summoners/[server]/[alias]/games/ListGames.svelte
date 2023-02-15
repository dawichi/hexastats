<!--
  @component
  ## List Games component
  List all games from a player
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { SummonerService } from '$lib/services/Summoner.service'
    import { playersContext } from '$lib/context/players'
    import Game from './Game.svelte'
    import MockGame from './MockGame.svelte'

    export let player: SummonerDto

    // Context
    let _players: SummonerDto[] = []
    playersContext.subscribe(players => (_players = players))

    // Load games logic
    let loadingGames: boolean = false

    async function loadMoreGames(): Promise<void> {
        loadingGames = true
        try {
            const newGames = await SummonerService.addGames(player.server, player.alias)
            playersContext.update(players =>
                players.map(_player =>
                    _player.alias === player.alias
                        ? {
                              ..._player,
                              games: [..._player.games, ...newGames],
                          }
                        : _player,
                ),
            )
        } catch (error) {
            console.error(error)
        }
        loadingGames = false
        filteredGames = player.games
        activeFilter = ''
    }

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

    {#each filteredGames as game}
        <Game {game} participant={game.participants[game.participantNumber]} />
    {/each}

    {#if player.games.length < 51}
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
    {/if}
</div>
