<!--
  @component
  ## List Games component
  List all games from a player
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    import Game from './Game.svelte'

    export let player: SummonerDto

    let loadingGames: boolean = false

    function loadMorePlayers(): void {
        loadingGames = true
        // await summonerService.addGames(player.server, player.alias, player.games.length)
        loadingGames = false
    }
</script>

<div>
    {#each player.games as game}
        <Game {game} />
    {/each}

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
</div>
