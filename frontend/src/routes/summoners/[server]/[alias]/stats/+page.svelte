<script lang="ts">
    import { page } from '$app/stores'
    import { Container } from '$lib/components'
    import { styles } from '$lib/config'
    import { RiotService } from '$lib/services/Riot.service'
    import type { StatsDto } from '$lib/types'
    import { winrate } from '$lib/utils'

    /** @type {import('./$types').PageData} */
    export let data: {
        stats: StatsDto
    }

    const [x, y, server, alias, page_num] = $page.url.pathname.split('/')

    const riotService = RiotService.getInstance()

    const replaceTitles: Record<string, string> = {
        championName: 'Champ',
    }
</script>

<Container disableHeader>
    <a href="/summoners/{server}/{alias}/1" class="rounded bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600">
        <i class="bi bi-arrow-90deg-left pr-2" /> BACK
    </a>

    <!-- CHAMPS TABLE -->
    <table class="{styles.foreground} {styles.card} mt-4">
        <tr>
            {#each Object.keys(data.stats.statsByChamp[0]) as prop_key}
                <td class="p-2">
                    {replaceTitles[prop_key] ?? prop_key.charAt(0).toUpperCase() + prop_key.slice(1)}
                </td>
            {/each}
        </tr>
        {#each Object.entries(data.stats.statsByChamp) as [idx, _]}
            <tr>
                {#each Object.entries(data.stats.statsByChamp[parseInt(idx)]) as [key, value]}
                    <td class="px-2 py-1">
                        {#if key === 'championName'}
                            <img class="w-12 rounded" src={riotService.champImage(value)} alt="champion" />
                        {:else if key === 'wins'}
                            {winrate(value, data.stats.statsByChamp[parseInt(idx)].games - value)}%
                        {:else}
                            {value}
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </table>
</Container>
