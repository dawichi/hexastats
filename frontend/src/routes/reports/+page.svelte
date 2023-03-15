<script lang="ts">
    import Container from '$lib/components/layout/Container.svelte'
    import { styles } from '$lib/config'
    import { LocalStorageService } from '$lib/services/LocalStorage.service'
    import { RiotService } from '$lib/services/Riot.service'
    import type { ReportDto } from '$lib/types'
    import { kda, parse_k_num } from '$lib/utils'
    import { onMount } from 'svelte'

    let reports: Array<ReportDto> = []
    onMount(() => {
        reports = LocalStorageService.reports.list()
        console.log(LocalStorageService.reports.list())
    })
</script>

<div>
    {#each reports as report}
        <div>{report.alias}</div>
        <div>{report.server}</div>
        <div>{report.image}</div>
        <div>{report.level}</div>
        <div>{report.rank}</div>
        <div>{report.stats_by_champ}</div>
        <div>{report.stats_by_position}</div>

        <div><img class="w-12" src={report.image} alt="" /></div>
        <div>{report.rank.flex.rank}</div>
        <div>{report.rank.solo.image}</div>
        <span>Winrate: {report.rank.flex.winrate}%</span>

        <!-- {#each Object.entries(report.stats_by_position) as [position, stats]}
            <div class="grid grid-cols-8 p-2 text-center">
                <span>{position}</span>
                <span>-</span>
                <span>-</span>
                <span>-</span>
                <span>{stats[0].kda.kills}/{stats[0].kda.deaths}/{stats[0].kda.assists}</span>
                <span>{stats[0].stats.avgDamageDealt.toFixed(0)}</span>
                <span>{stats[0].stats.avgDamageTaken.toFixed(0)}</span>
            </div>
        {/each} -->
    {/each}
</div>

{#if reports.length}
    <Container title="" description="" disableHeader>
        <div class="relative rounded-lg bg-contain shadow">
            <section class="bg-orange-50/80 dark:bg-zinc-900/80 md:px-4">
                <header class="flex flex-col items-center justify-around py-5 lg:flex-row" />

                <div class="grid-col">
                    <aside class="lg:grid-col grid">
                        <div class="{styles.foreground} {styles.card} m-2 mb-4">
                            <h2 class="pt-3 text-center text-2xl">Stats by champ</h2>
                            <div class="grid grid-cols-8 p-2 text-center">
                                <span>Name</span>
                                <span>Server</span>
                                <span>Image</span>
                                <span>Level</span>
                                <span>KDA</span>
                                <span>Damage Dealt</span>
                                <span>Damage Taken</span>
                                <span>Winrate</span>
                            </div>
                            <hr class="m-2" />

                            {#each reports as report}
                                <div class="grid grid-cols-8 text-center">
                                    <span>{report.alias}</span>
                                    <span>{report.server}</span>
                                    <span><img class="w-12" src={report.image} alt="" /></span>
                                    <span>{report.level}</span>
                                    <span>{''}/{''}/{''}</span>
                                    <span>{''}</span>
                                    <span>{''}</span>
                                    <!-- <span>{report.stats_by_champ[Object.keys(report.stats_by_champ)[0]][0].stats.avgDamageTaken.toFixed(0)}</span> -->
                                    <span>{report.rank.flex.winrate}%</span>

                                    {#each Object.entries(report.stats_by_position) as [position, stats]}
                                        <div class="grid grid-cols-8 p-2 text-center">
                                            <span>{position}</span>
                                            <span>-</span>
                                            <span>-</span>
                                            <span>-</span>
                                            <!-- <span>{stats[0].kda.kills}/{stats[0].kda.deaths}/{stats[0].kda.assists}</span>
                                        <span>{stats[0].stats.avgDamageDealt.toFixed(0)}</span>
                                        <span>{stats[0].stats.avgDamageTaken.toFixed(0)}</span>
                                        <span>{stats[0].winrate}</span> -->
                                        </div>
                                    {/each}
                                </div>
                            {/each}
                        </div>

                        <div>
                            <div>
                                <div class="flex flex-col">
                                    <div class="{styles.foreground} {styles.card} m-2 mb-4">
                                        <h2 class="pt-3 text-center text-2xl">Stats by positions</h2>
                                        <hr class="m-2" />
                                        <div class="grid grid-cols-1 text-left">
                                            <span>TOP</span>
                                            <span>Jungle</span>
                                            <span>MID</span>
                                            <span>ADC</span>
                                            <span>Support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>

        <section class="{styles.foreground} rounded p-4">
            <h2 class="px-4 text-2xl">Positions analysis</h2>
            <hr class="mt-2 mb-4 w-96" />

            <section class="mb-4 grid grid-cols-6 gap-2">
                <h4>Role</h4>
                <h4>Wins</h4>
                <h4>Winrate</h4>
            </section>

            {#each Object.keys(reports[0].stats_by_position) as key}
                <div class="grid grid-cols-6 items-center gap-2 text-sm md:text-base">
                    <img src={RiotService.teamPositionIcon(key)} width={35} height={35} alt="position" />
                    <span>{reports[0].stats_by_position[key].wins} / {reports[0].stats_by_position[key].games}</span>

                    <div class="grid grid-cols-4">
                        <p>
                            {kda(
                                reports[0].stats_by_position[key].kda.kills,
                                reports[0].stats_by_position[key].kda.deaths,
                                reports[0].stats_by_position[key].kda.assists,
                            )}
                        </p>
                        <p><span class="rounded bg-green-600 p-1">{reports[0].stats_by_position[key].kda.kills}</span></p>
                        <p><span class="rounded bg-red-600 p-1">{reports[0].stats_by_position[key].kda.deaths}</span></p>
                        <p><span class="rounded bg-indigo-600 p-1">{reports[0].stats_by_position[key].kda.assists}</span></p>
                    </div>

                    <div class="grid grid-cols-2">
                        <p><span>{reports[0].stats_by_position[key].farm.cs} ({reports[0].stats_by_position[key].farm.csmin})</span></p>
                        <p><span class="p-1">{parse_k_num(reports[0].stats_by_position[key].farm.gold)}<i class="text-yellow-500 ml-2 bi bi-coin"></i></span></p>
                    </div>

                    <div class="grid grid-cols-4">
                        <p>x2 {reports[0].stats_by_position[key].multiKill.doubles}</p>
                        <p>x3 {reports[0].stats_by_position[key].multiKill.triples}</p>
                        <p>x4 {reports[0].stats_by_position[key].multiKill.quadras}</p>
                        <p>x5 {reports[0].stats_by_position[key].multiKill.pentas}</p>
                    </div>

                    <div class="grid grid-cols-4">
                        <p>x2 {reports[0].stats_by_position[key].stats.maxKills}</p>
                        <p>x3 {reports[0].stats_by_position[key].stats.maxDeaths}</p>
                        <p>x4 {reports[0].stats_by_position[key].stats.avgDamageDealt}</p>
                        <p>x5 {reports[0].stats_by_position[key].stats.visionScore}</p>
                    </div>

                    <!-- <span class="{position.games ? '' : 'invisible'} {styleWinrate(winrate(position.wins, position.games - position.wins))}">{winrate(position.wins, position.games - position.wins)} %</span> -->
                    <!-- <div class="col-span-3 h-2 rounded overflow-hidden bg-zinc-600"> -->
                    <!-- <div class="flex" style="width: {(position.games / buildPosition(player).maxGames) * 100}%"> -->
                    <!-- GREEN BAR: represents number of wins -->
                    <!-- <div class="h-2 bg-green-400" style="width: {(position.wins / position.games) * 100}%" /> -->
                    <!-- RED BAR: represents number of defeats -->
                    <!-- <div class="h-2 rounded-r bg-red-400" style="width: {((position.games - position.wins) / position.games) * 100}%" /> -->
                    <!-- </div> -->
                    <!-- </div> -->
                </div>
            {/each}
        </section>
    </Container>
{/if}
