<!-- Visualize the player details -->
<script lang="ts">
    import { Pagination } from '$lib/components'
    import type { StatsDto, SummonerDto } from '$lib/types'
    import Game from './games/Game.svelte'

    /** @type {import('./$types').PageData} */
    export let data: {
        player: SummonerDto
        stats: StatsDto
    }
</script>

<div>
    <div class="flex items-center justify-center gap-2 px-4">
        <hr class="w-full" />
        <span class="whitespace-nowrap">
            Games loaded: {data.player.games.length}
        </span>
        <hr class="w-full" />
    </div>

    <div class="grid gap-2">
        {#each data.player.games as game}
            <Game {game} server={data.player.server} />
        {/each}
    </div>

    <Pagination />
</div>
