<script lang="ts">
    import Container from '$lib/components/layout/Container.svelte'
    import { styles } from '$lib/config'
    import { reportsContext, type ReportDto } from '$lib/context/reports'

    let _reports: ReportDto[] = []
    reportsContext.subscribe(data => (_reports = data))
</script>

<div>
    {#each _reports as report}
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
    -------------------------------
</div>

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

                        {#each _reports as report}
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
</Container>
