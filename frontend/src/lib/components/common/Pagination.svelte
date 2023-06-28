<script lang="ts">
    import { page } from '$app/stores'

    const [x, y, server, summoner, page_num] = $page.url.pathname.split('/')
    const color = 'rounded bg-indigo-400 px-4 py-1 shadow-md hover:bg-indigo-600 hover:shadow-indigo-500'
</script>

<div class="flex items-center justify-between py-4 px-8">
    {#if Number(page_num) > 1}
        <a class="${color} rounded" href="/summoners/{server}/{summoner}/{Number(page_num) - 1}">
            <i class="bi bi-arrow-left" />
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

    <div />

    <a class="${color} rounded" href="/summoners/{server}/{summoner}/{Number(page_num) + 1}">
        Next
        <i class="bi bi-arrow-right" />
    </a>
</div>
