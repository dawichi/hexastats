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
            playersContext.update(players => players.map(p => (p.alias === player.alias ? {
                ...p,
                games: [...p.games, ...newGames]
            } : p)))
        } catch (error) {
            console.error(error)
        }
        loadingGames = false
    }

    // Utils
</script>

<div>
    {#each player.games as game}
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
