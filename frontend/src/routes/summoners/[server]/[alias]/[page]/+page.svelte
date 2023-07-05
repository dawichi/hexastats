<!-- Visualize the player details -->
<script lang="ts">
    import { Pagination } from '$lib/components'
    import type { GameDto } from '$lib/types'
    import Game from './games/Game.svelte'

    /** @type {import('./$types').PageData} */
    export let data: {
        server: string
        games: GameDto[]
    }
</script>

<div>
    <div class="flex items-center justify-center gap-2 px-4">
        <hr class="w-full" />
        <span class="whitespace-nowrap">
            Games loaded: {data.games.length}
        </span>
        <hr class="w-full" />
    </div>

    <div class="grid gap-2">
        {#each data.games as game}
            <Game {game} server={data.server} />
        {/each}
    </div>

    <Pagination />
</div>
