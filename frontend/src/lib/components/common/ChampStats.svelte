<script lang="ts">
    import { styles } from '$lib/config'
    import { RiotService } from '$lib/services/Riot.service'
    import { SummonerService } from '$lib/services/Summoner.service'
    import type { ChampStatsDto, StatsDto } from '$lib/types'
    import { parse_k_num, winrate } from '$lib/utils'
    import Button from './Button.svelte'

    export let stats: StatsDto

    const riotService = RiotService.getInstance()
    const summonerService = SummonerService.getInstance()

    const replaceTitles: Record<string, string> = {
        championName: 'Champ',
        wins: 'Winrate',
        killParticipation: 'KillP%',
        damageDealt: 'DmgDealt',
        damageTaken: 'DmgTaken',
    }

    /**
     * Highlights table cells based on the stat requirements
     * @param num the value of the cell
     * @param type the type of stat
     */
    const tint = (num: number, type: string): string => {
        const tints: Record<string, (x: number) => string> = {
            games: (x: number) => (x >= 10 ? 'bg-green-200 dark:bg-green-700' : ''),
            winrate: (x: number) => (x >= 55 ? 'bg-sky-200 dark:bg-sky-700' : ''),
            kda: (x: number) => (x >= 3 ? 'bg-purple-200 dark:bg-purple-700 p-1' : ''),
            kills: (x: number) => (x >= 10 ? 'bg-red-200 dark:bg-red-700 p-1' : ''),
            deaths: (x: number) => (x <= 5 ? 'bg-zinc-300 dark:bg-zinc-400 p-1' : ''),
            assists: (x: number) => (x >= 10 ? 'bg-pink-200 dark:bg-pink-700 p-1' : ''),
            csmin: (x: number) => (x >= 7 ? 'bg-yellow-200 dark:bg-yellow-700 p-1' : ''),
        }
        return tints[type]?.(num) ?? ''
    }

    const orderByProp: {
        prop: keyof ChampStatsDto
        asc: boolean
    } = {
        prop: 'games',
        asc: false,
    }

    const sortRows = (by: string): void => {
        if (by === orderByProp.prop) {
            orderByProp.asc = !orderByProp.asc
        } else {
            orderByProp.prop = by as keyof ChampStatsDto
            orderByProp.asc = false
        }
    }

    const ascDesc = (asc: boolean, a: number, b: number) => asc ? a - b : b - a
    $: stats.statsByChamp = stats.statsByChamp.sort((a, b) => ascDesc(orderByProp.asc, Number(a[orderByProp.prop]), Number(b[orderByProp.prop])))
</script>

<div class="{styles.foreground} {styles.card} col-span-2 px-2 pb-2">
    <h3 class="pt-3 text-center text-2xl">All your played champs ({Object.keys(stats.statsByChamp).length})</h3>
    <hr class="m-2" />
    <table>
        <tr>
            {#each Object.keys(stats.statsByChamp[0]) as prop_key}
                <td class="p-2">
                    {#if prop_key !== 'championName'}
                        <button class={prop_key === orderByProp.prop ? 'border-b-2 border-indigo-600' : ''} on:click={() => sortRows(prop_key)}>
                            {replaceTitles[prop_key] ?? prop_key.charAt(0).toUpperCase() + prop_key.slice(1)}
                            <i class="bi bi-arrow-{prop_key === orderByProp.prop && orderByProp.asc ? 'up' : 'down'}-short" />
                        </button>
                    {/if}
                </td>
            {/each}
        </tr>
        {#each Object.entries(stats.statsByChamp) as [idx, _]}
            <tr>
                {#each Object.entries(stats.statsByChamp[parseInt(idx)]) as [key, value]}
                    <td class="px-2 py-1">
                        {#if key === 'championName'}
                            <img class="w-12 rounded" src={riotService.champImage(value)} alt="champion" />
                        {:else if key === 'wins'}
                            <span class={tint(winrate(value, stats.statsByChamp[parseInt(idx)].games - value), 'winrate')}>
                                {winrate(value, stats.statsByChamp[parseInt(idx)].games - value)}%
                            </span>
                        {:else if key === 'killParticipation'}
                            {Math.round(value * 100)} %
                        {:else if ['damageDealt', 'damageTaken'].includes(key)}
                            {parse_k_num(value)}
                        {:else}
                            <span class={tint(value, key)}>
                                {value}
                            </span>
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </table>
</div>
