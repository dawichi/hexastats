<!--
  @component
  ## Mastery Page
  Visualize the masteries of a player
-->
<script lang="ts">
    import type { MasteryDto, SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { parse_k_num } from '$lib/utils'
    import { playersContext } from '$lib/context/players'
    import { Container, EmptyPlayers, Image, ProfileImg } from '$lib/components'

    // Context
    let _players: SummonerDto[] = []
    playersContext.subscribe(players => (_players = players))

    function totalMasteries(masteries: MasteryDto[]) {
        return masteries.reduce((acc, curr) => acc + curr.points, 0)
    }
</script>

{#if _players.length}
    <Container title="Mastery" description="Your 7 champions with most points">
        <div class="grid gap-4 2xl:grid-cols-2">
            {#each _players as player}
                <div class="m-2 p-2 {styles.card} {styles.foreground} grid-cols-4 md:grid">
                    <div class="flex items-center">
                        <ProfileImg image={player.image} level={player.level} />
                        <div class="flex flex-col">
                            <h2 class="text-xl">{player.alias}</h2>
                            {#if totalMasteries(player.masteries)}
                                <h4>{parse_k_num(totalMasteries(player.masteries), 0, false)}</h4>
                            {:else}
                                <span>No data</span>
                            {/if}
                        </div>
                    </div>
                    <div class="col-span-3 grid grid-cols-4 sm:grid-cols-7">
                        {#each player.masteries.slice(0, 7) as mastery}
                            <div class="p-2 text-center">
                                <span>
                                    {mastery.points > 100000 ? '🔥' : ''}
                                    {parse_k_num(mastery.points, 0, true)}
                                </span>
                                <div class="flex items-center justify-center">
                                    <div class="relative flex h-24 w-16 justify-center">
                                        <div class="t-0 r-0 absolute">
                                            <div class="relative h-28 w-16 rounded">
                                                <Image image={'/images/mastery/mastery_' + mastery.level + '.png'} />
                                            </div>
                                        </div>
                                        <div class="t-0 r-0 absolute">
                                            <div class="relative h-16 w-16 rounded">
                                                <Image image={mastery.image} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </Container>
{:else}
    <EmptyPlayers />
{/if}
