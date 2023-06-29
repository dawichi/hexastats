<script lang="ts">
    import { page } from '$app/stores'
    import { Container } from '$lib/components'
    import { styles } from '$lib/config'
    import { RiotService } from '$lib/services/Riot.service'
    import { SummonerService } from '$lib/services/Summoner.service'
    import type { StatsDto } from '$lib/types'
    import { winrate } from '$lib/utils'
    import ListFriends from '../[page]/ListFriends.svelte'
    import ListPositions from '../[page]/ListPositions.svelte'
    import RecordCard from './RecordCard.svelte'

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

    /**
     * Highlights table cells based on the stat requirements
     * @param num the value of the cell
     * @param type the type of stat
     */
     const tint = (num: number, type: string): string => {
        const tints: Record<string, (x: number) => string> = {
            games: (x: number) => (x >= 50 ? 'bg-green-200 dark:bg-green-700' : ''),
            winrate: (x: number) => (x >= 55 ? 'bg-sky-200 dark:bg-sky-700' : ''),
            kda: (x: number) => (x >= 3 ? 'bg-purple-200 dark:bg-purple-700 p-1' : ''),
            kills: (x: number) => (x >= 10 ? 'bg-red-200 dark:bg-red-700 p-1' : ''),
            deaths: (x: number) => (x <= 5 ? 'bg-zinc-300 dark:bg-zinc-400 p-1' : ''),
            assists: (x: number) => (x >= 10 ? 'bg-pink-200 dark:bg-pink-700 p-1' : ''),
            csmin: (x: number) => (x >= 7 ? 'bg-yellow-200 dark:bg-yellow-700 p-1' : ''),
        }
        return tints[type]?.(num) ?? ''
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
    <div class="flex gap-4 p-2">
        <RecordCard data={data.stats.records.kda} title="KDA" />
        <RecordCard data={data.stats.records.kills} title="Kills" />
        <RecordCard data={data.stats.records.deaths} title="Deaths" />
        <RecordCard data={data.stats.records.assists} title="Assists" />
        <RecordCard data={data.stats.records.gold} title="Gold" />
        <RecordCard data={data.stats.records.goldPerMin} title="Gold/min" />
        <RecordCard data={data.stats.records.cs} title="CS" />
        <RecordCard data={data.stats.records.csPerMin} title="CS/min" />
        <RecordCard data={data.stats.records.vision} title="Vision" />
        <RecordCard data={data.stats.records.visionPerMin} title="Vision/min" />
        <RecordCard data={data.stats.records.gameDuration} title="game duration" />
        <RecordCard data={data.stats.records.doubleKills} title="x2" />
        <RecordCard data={data.stats.records.tripleKills} title="x3" />
        <RecordCard data={data.stats.records.quadraKills} title="x4" />
        <RecordCard data={data.stats.records.pentaKills} title="x5" />
    </div>
</Container>
