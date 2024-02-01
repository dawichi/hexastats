<!--
  @component
  ## Rank Structure component
  Display an image using `background-image` instead of `<img/>`
  @param player - the player data. Use NULL to display a placeholder
-->
<script lang="ts">
    import type { RankDataDto } from '$lib/types'
    import { MockImage } from '..'
    import ProfileImg from './ProfileImg.svelte'
    import Rank from './Rank.svelte'

    export let player: RankDataDto | null = null
</script>

{#if player}
    <div class="flex items-center justify-center gap-4">
        <div class="flex flex-col items-center justify-center overflow-hidden">
            <ProfileImg image={player.image} level={player.level} />
            <h2 class="mt-1 text-xl">{player.riotIdName}</h2>
            <h2 class="text-xl opacity-30">#{player.riotIdTag}</h2>
        </div>
        <Rank title="Solo/Duo" rankdata={player.rank.solo} />
        <Rank title="Flex" rankdata={player.rank.flex} />
        {#if player.rank.arena.win + player.rank.arena.lose > 0}
            <Rank title="Arena" rankdata={player.rank.arena} />
        {/if}
    </div>
{:else}
    <!-- Display a placeholder until data is ready -->
    <div class="flex h-full animate-pulse items-centarer justify-around gap-4">
        <div class="flex flex-col items-center justify-center overflow-hidden">
            <!-- ProfileImg -->
            <MockImage />

            <!-- Title -->
            <div class="mt-2 h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        <!-- Rank 1 -->
        <div class="flex flex-col items-center justify-center">
            <div class="my-1 h-2.5 w-16 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div class="my-1 h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <MockImage />
            <div class="flex gap-2">
                <div class="my-1 h-2.5 w-8 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div class="my-1 h-2.5 w-8 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div class="my-1 h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        <!-- Rank 2 -->
        <div class="flex flex-col items-center justify-center">
            <div class="my-1 h-2.5 w-16 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div class="my-1 h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <MockImage />
            <div class="flex gap-2">
                <div class="my-1 h-2.5 w-8 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div class="my-1 h-2.5 w-8 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div class="my-1 h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>
    </div>
{/if}
