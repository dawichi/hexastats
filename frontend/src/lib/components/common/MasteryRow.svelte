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
    {#each [0, 1, 2, 3, 4, 5] as idx}
        <div class="p-2 text-center">
            <span class="whitespace-nowrap">{parse_k_num(masteries[idx].points, 0, true)}</span>

            <div class="flex items-center justify-center">
                <div class="relative flex h-24 w-16 justify-center">
                    <div class="t-0 r-0 absolute">
                        <div class="relative h-24 w-12 rounded">
                            {#if [5, 6, 7].includes(masteries[idx].level)}
                                <Image image={'/images/mastery/mastery_' + masteries[idx].level + '.png'} />
                            {/if}

                            {#if masteries[idx].chestGranted}
                                <span class="absolute -top-1 -right-3 z-20 h-6 w-6 rounded-full">
                                    <Image image="/images/mastery/chest.png" />
                                </span>
                            {/if}
                        </div>
                    </div>

                    <div class="t-0 r-0 absolute">
                        <div class="relative h-12 w-12 rounded">
                            <Image image={masteries[idx].image} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>
