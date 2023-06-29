<script lang="ts">
    import { page } from '$app/stores'
    import { Container } from '$lib/components'
    import { styles } from '$lib/config'
    import { RiotService } from '$lib/services/Riot.service'
    import { SummonerService } from '$lib/services/Summoner.service'
    import type { StatsDto } from '$lib/types'
    import { winrate } from '$lib/utils'
    import { prop_dev } from 'svelte/internal'
    import ListFriends from '../[page]/ListFriends.svelte'
    import ListPositions from '../[page]/ListPositions.svelte'

    /** @type {import('./$types').PageData} */
    export let data: {
        stats: StatsDto
    }
    let loading = false

    const [x, y, server, alias, page_num] = $page.url.pathname.split('/')

    const riotService = RiotService.getInstance()
    const summonerService = SummonerService.getInstance()

    const replaceTitles: Record<string, string> = {
        championName: 'Champ',
        wins:'Winrate',
        killParticipation: 'KillP%',
        damageDealt: 'DmgDealt',
        damageTaken: 'DmgTaken',
    }

    async function handleMoreGames() {
        // Prevent multiple requests
        if (loading) return

        loading = true
        data.stats = await summonerService.addStats(server, `${decodeURI(alias)}`)
        loading = false
    }
</script>


<Container disableHeader>
    <a href="/summoners/{server}/{alias}/1" class="rounded bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600">
        <i class="bi bi-arrow-90deg-left pr-2" /> BACK
    </a>

    <button on:click={handleMoreGames} class="block rounded bg-indigo-500 mt-2 px-2 text-white hover:bg-indigo-600">
        {#if loading}
            <i class="bi bi-arrow-clockwise animate block animate-spin" />
        {:else}
            ADD +10
        {/if}
    </button>

    <h2 class="text-3xl text-center">{alias}'s Stats</h2>
    <p class="text-sm text-center pb-4">based in last  {data.stats.gamesUsed.length} games</p>
    <hr />

    <!-- WRAPPER: STATS -->
    <div class="grid grid-cols-3 gap-4 p-2">
        <!-- LEFT COLUMN: POSITIONS AND FRIENDS -->
        <aside class="gap-4 flex flex-col">
            <!-- POSITIONS LIST -->
            <div class="{styles.foreground} {styles.card}">
                <ListPositions positions={data.stats.statsByPosition} />
            </div>
            <!-- FRIENDS LIST -->
            <div class="{styles.foreground} {styles.card}">
                <ListFriends friends={data.stats.friends} />
            </div>
        </aside>
    
        <!-- RIGHT COLUMN: CHAMPS TABLE -->
        <div class="{styles.foreground} {styles.card} col-span-2 px-2 pb-2">
            <h3 class="text-2xl text-center pt-3">All your played champs ({Object.keys(data.stats.statsByChamp).length})</h3>
            <hr class="m-2"/>
            <table>
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
        </div>
    </div>

    <br/>
    <br/>
    <br/>
    <h2 class="text-3xl text-center">{alias}'s Records</h2>
    <p class="text-sm text-center pb-4">based in last {data.stats.gamesUsed.length} games</p>
    <hr />

    <button on:click={handleMoreGames} class="block rounded bg-indigo-500 mt-2 px-2 text-white hover:bg-indigo-600">
        {#if loading}
            <i class="bi bi-arrow-clockwise animate block animate-spin" />
        {:else}
            ADD +10
        {/if}
    </button>
    <!-- WRAPPER: RECORDS -->
    <div class="grid gap-4 p-2">
       <p>{data.stats.records.kda.value}</p>
       <p>{data.stats.records.kda.matchId}</p>

       <p>{data.stats.records.kills.value}</p>
       <p>{data.stats.records.kills.matchId}</p>

       <p>{data.stats.records.deaths.value}</p>
       <p>{data.stats.records.deaths.matchId}</p>

       <p>{data.stats.records.assists.value}</p>
       <p>{data.stats.records.assists.matchId}</p>

       <p>{data.stats.records.gold.value}</p>
       <p>{data.stats.records.gold.matchId}</p>

       <p>{data.stats.records.cs.value}</p>
       <p>{data.stats.records.cs.matchId}</p>

       <p>{data.stats.records.vision.value}</p>
       <p>{data.stats.records.vision.matchId}</p>
    </div>
</Container>
