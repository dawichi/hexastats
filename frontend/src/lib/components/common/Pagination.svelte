<script lang="ts">
    import { page } from "$app/stores"

    const [x, y, server, summoner, page_num] = $page.url.pathname.split("/")
</script>

<div class="flex items-center justify-between py-4 px-8">
    {#if Number(page_num) > 1}
        <a class="bg-indigo-400 rounded px-4 py-1" href="/summoners/{server}/{summoner}/{Number(page_num) - 1}">
            <i class="bi bi-arrow-left"></i>
            Previous
        </a>
    {/if}

    <!-- <div class="flex items-center justify-center gap-2">
        {#each Array.from({ length: pages }) as _, idx}
            <a class="bg-indigo-400 rounded px-4 py-1" href={`/summoners/euw/Dawichii/${idx+1}`}>
                {idx+1}
            </a>
        {/each}
        <button class="bg-indigo-400 rounded px-4 py-1">
            <i class="bi bi-arrow-clockwise"></i> Load more
        </button>
    </div> -->

    <div>

    </div>

    <a class="bg-indigo-400 rounded px-4 py-1" href="/summoners/{server}/{summoner}/{Number(page_num) + 1}">
        Next
        <i class="bi bi-arrow-right"></i>
    </a>
</div>
