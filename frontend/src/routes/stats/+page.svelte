<!--
  @component
  ## Stats Page
  Visualize each player in a table
  Each row of the table is a champ with his stats
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { playersContext } from '$lib/context/players'
    import { Container, EmptyPlayers, Image, RankStructure } from '$lib/components'
    import { ChampService } from '$lib/services/Champ.service'

    // Context
    let _players: SummonerDto[] = []
    playersContext.subscribe(players => (_players = players))

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

    // ┌──────────────────────────────────
    // │ Returns a row of a table <tr>
    // └──────────────────────────────────
    // const TintRow = ({ tint, title, data }: { tint: string; title: any; data: number }) => (
    //     <tr>
    //         <td class='p-1'>
    //             <span class={tint}>{title}</span>
    //         </td>
    //         <td>{data.toLocaleString('en-US')}</td>
    //     </tr>
    // )
</script>

{#if _players.length}
    <Container title="Stats" description="Basic stats of your 7 most played champs">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <!-- For each player, print a table and its table-head -->
            {#each _players as player}
                <div class={`flex flex-col ${styles.foreground} ${styles.card}`}>
                    <div class="p-4">
                        <RankStructure {player} />
                    </div>

                    <table class={`table-auto m-3 text-center border dark:border-zinc-500`}>
                        <thead>
                            <tr>
                                <th class="bg-zinc-300 py-1 px-2 dark:bg-zinc-800">Champ</th>
                                <th class={styles.stat.games}>Games</th>
                                <th class={styles.stat.kda}>KDA</th>
                                <th class={styles.stat.kills}>K</th>
                                <th class={styles.stat.deaths}>D</th>
                                <th class={styles.stat.assists}>A</th>
                                <th class={styles.stat.cs}>CSM</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- For each champ inside a player, print a row with the data -->
                            {#each ChampService.champsBuilder(player.games) as champ}
                                <tr class="border dark:border-zinc-500">
                                    <td>
                                        <div class="relative">
                                            <div class="relative mt-2 h-10 w-10 justify-center p-1">
                                                <Image image={champ.image} />
                                            </div>
                                            <!-- TODO: Tooltip con info extra, quizás repensarlo como /summoner? maybe -->
                                            <!-- <Popover.Panel class='absolute z-10 transform translate-x-1/4 -translate-y-1/2 left-1/2 w-64'>
                                            <div class={`p-4 border border-zinc-400 shadow-xl rounded-lg ${styles.foreground}`}>
                                                <div class='p-1 ml-2 w-10 relative h-10'>
                                                    <Image src={champ.image} alt='champ image' layout='fill' />
                                                </div>
                                                <table class='text-right'>
                                                    <tbody>
                                                        <TintRow title={'cs'} tint={styles.stat.cs} data={champ.cs} />
                                                        <TintRow title={'cs/min'} tint={styles.stat.cs} data={champ.csmin} />
                                                        <TintRow
                                                            title={<i class='bi bi-currency-exchange'></i>}
                                                            tint={'text-yellow-500'}
                                                            data={champ.gold}
                                                        />
                                                        <TintRow
                                                            title={'Max Kills'}
                                                            tint={styles.stat.kills}
                                                            data={champ.maxKills}
                                                        />
                                                        <TintRow
                                                            title={'Max Deaths'}
                                                            tint={styles.stat.deaths}
                                                            data={champ.maxDeaths}
                                                        />
                                                        <TintRow
                                                            title={'Damage'}
                                                            tint={styles.stat.kills}
                                                            data={champ.avgDamageDealt}
                                                        />
                                                        <TintRow
                                                            title={<i class='bi bi-shield-shaded'></i>}
                                                            tint={'text-green-500'}
                                                            data={champ.avgDamageTaken}
                                                        />
                                                        <TintRow
                                                            title={'x 2'}
                                                            tint={styles.stat.assists}
                                                            data={champ.doubleKills}
                                                        />
                                                        <TintRow title={'x 3'} tint={styles.stat.games} data={champ.tripleKills} />
                                                        <TintRow
                                                            title={'x 4'}
                                                            tint={styles.stat.winrate}
                                                            data={champ.quadraKills}
                                                        />
                                                        <TintRow title={'x 5'} tint={styles.stat.kda} data={champ.pentaKills} />
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Popover.Panel> -->
                                        </div>
                                    </td>
                                    <td>
                                        <span class={tint(champ.games, 'games')}>{champ.games}</span> (
                                        <span class={tint(champ.winrate, 'winrate')}>{champ.winrate}%</span>)
                                    </td>
                                    <td>
                                        <span class={tint(champ.kda, 'kda')}>{champ.kda}</span>
                                    </td>
                                    <td>
                                        <span class={tint(champ.kills, 'kills')}>{champ.kills}</span>
                                    </td>
                                    <td>
                                        <span class={tint(champ.deaths, 'deaths')}>{champ.deaths}</span>
                                    </td>
                                    <td>
                                        <span class={tint(champ.assists, 'assists')}>{champ.assists}</span>
                                    </td>
                                    <td>
                                        <span class={tint(champ.csmin, 'csmin')}>{champ.csmin}</span>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/each}
        </div>
    </Container>
{:else}
    <EmptyPlayers />
{/if}
