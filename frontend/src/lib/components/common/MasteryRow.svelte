<!--
  @component
  ## MasteryRow
  Displays a row of masteries
  @param masteries - the masteries array
-->
<script lang="ts">
    import type { MasteryDto } from '$lib/types'
    import { parse_k_num } from '$lib/utils'
    import Image from './Image.svelte'

    export let masteries: MasteryDto[]
</script>

<div class="grid w-96 grid-cols-6">
    {#each masteries.slice(0,6) as mastery}
        <div class="p-2 text-center">
            <span class="whitespace-nowrap">{parse_k_num(mastery.points, 0, true)}</span>

            <div class="flex items-center justify-center">
                <div class="relative flex h-24 w-16 justify-center">
                    <div class="t-0 r-0 absolute">
                        <div class="relative h-24 w-12 rounded">
                            {#if [5, 6, 7].includes(mastery.level)}
                                <Image image={'/images/mastery/mastery_' + mastery.level + '.png'} />
                            {/if}

                            {#if mastery.chestGranted}
                                <span class="absolute -top-1 sm:-right-3 z-20 h-6 w-6 rounded-full">
                                    <Image image="/images/mastery/chest.png" />
                                </span>
                            {/if}
                        </div>
                    </div>

                    <div class="t-0 r-0 absolute">
                        <div class="relative h-12 w-12 rounded">
                            <Image image={mastery.image} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>
