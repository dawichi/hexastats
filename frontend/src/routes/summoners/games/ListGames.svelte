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

    export let player: SummonerDto

    // Context
    let _players: SummonerDto[] = []
    playersContext.subscribe(players => (_players = players))
    
    let loadingGames: boolean = false

    async function loadMorePlayers(): Promise<void> {
        loadingGames = true
        try {

            const playerData = await SummonerService.addGames(player.server, player.alias, player.games.length)
            playersContext.update(players => {
                players = players.map(p => (p.alias === player.alias ? playerData : p))
                localStorage.setItem('players', JSON.stringify(players))
                return players
            })
        } catch (error) {
            console.error(error)
        }
        loadingGames = false
    }
</script>

<div>
    {#each player.games as game}
        <Game {game} participant={game.participants[game.participantNumber]} />
    {/each}

    {#if player.games.length < 51}
        <div class="flex justify-center">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <button on:click={loadMorePlayers} class={`${styles.card} ${styles.scale} bg-indigo-600 text-white cursor-pointer mx-4 my-2 p-3 px-6`}>
                {#if loadingGames}
                    <div class="flex items-center justify-center">
                        <i class="bi bi-arrow-clockwise block animate-spin " />
                        <span class="ml-3">Loading...</span>
                    </div>
                {:else}
                    <span>Load more</span>
                {/if}
            </button>
        </div>
    {/if}
</div>
