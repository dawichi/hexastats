<script lang="ts">
    import { Image, ProfileImg } from "$lib/components"
    import { styles } from "$lib/config"
    import type { MasteryDto, SummonerDto } from "$lib/types"
    import { parse_k_num } from "$lib/utils"

    export let player: SummonerDto

    /**
     * Get the total sum of all masteries
     * @param masteries - Array of masteries
     */
    function totalMasteries(masteries: MasteryDto[]): number {
        return masteries.reduce((acc, curr) => acc + curr.points, 0)
    }

</script>

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

    <div class="col-span-3 flex flex-wrap">
        {#each player.masteries as mastery}
            <div class="p-2 text-center">
                <span class="whitespace-nowrap">
                    {mastery.points > 100000 ? '🔥' : ''}
                    {parse_k_num(mastery.points, 0, true)}
                </span>

                <div class="flex items-center justify-center">
                    <div class="relative flex h-24 w-16 justify-center">
                        <div class="t-0 r-0 absolute">
                            <div class="relative h-28 w-16 rounded">
                                <Image image={'/images/mastery/mastery_' + mastery.level + '.png'} />

                                {#if mastery.chestGranted}
                                <span class="absolute w-6 h-6 -top-1 -right-3 z-20 rounded-full">
                                        <Image image='/images/mastery/chest.png' />

                                    </span>
                                {/if}
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