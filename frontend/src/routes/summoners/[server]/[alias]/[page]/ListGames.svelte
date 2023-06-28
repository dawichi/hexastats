<!--
  @component
  ## List Games component
  List all games from a player
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import Game from './games/Game.svelte'
    import { Pagination } from '$lib/components'

    export let player: SummonerDto
</script>

<div>
    <div class="flex items-center justify-center gap-2 px-4">
        <hr class="w-full" />
        <span class="whitespace-nowrap">
            Games loaded: {player.games.length}
        </span>
        <hr class="w-full" />
    </div>

    <div class="grid gap-2">
        {#each player.games as game}
            <Game {game} server={player.server} />
        {/each}
    </div>

    <Pagination />
</div>
