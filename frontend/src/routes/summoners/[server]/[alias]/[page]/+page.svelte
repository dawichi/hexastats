<!-- Visualize the player details -->
<script lang="ts">
    import { GameBase, Pagination } from '$lib/components'

    export let data
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
            <GameBase {game} server={data.server} />
        {/each}
    </div>

    <Pagination />
</div>
