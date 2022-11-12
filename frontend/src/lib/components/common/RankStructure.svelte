<!--
  @component
  ## Rank Structure component
  Display an image using `background-image` instead of `<img/>`
  @param player - the player data. Use NULL to display a placeholder
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import ProfileImg from './ProfileImg.svelte'
    import Rank from './Rank.svelte'

    export let player: SummonerDto | null = null
</script>

{#if player}
    <div class="flex items-center justify-center gap-4">
        <div class="flex flex-col items-center justify-center overflow-hidden">
            <ProfileImg image={player.image} level={player.level} />
            <h2 class="mt-2 text-xl">{player.alias && player.alias}</h2>
        </div>
        <Rank title={'Solo/Duo'} rankdata={player.rank.solo} />
        <Rank title={'Flex'} rankdata={player.rank.flex} />
    </div>
{:else}
    <!-- Display a placeholder until data is ready -->
    <div class="flex h-full animate-pulse items-centarer justify-around gap-4">
        <div class="flex flex-col items-center justify-center overflow-hidden">
            <!-- ProfileImg -->
            <div class="flex h-14 w-14 items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
                <svg
                    width="26"
                    height="26"
                    class="text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                    ><path
                        d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"
                    /></svg
                >
            </div>
            <!-- Title -->
            <div class="mt-2 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <!-- Rank 1 -->
        <div class="flex flex-col items-center justify-center">
            <div class="my-1 h-2.5 w-16 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div class="my-1 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div class="flex h-14 w-14 items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
                <svg
                    width="26"
                    height="26"
                    class="text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                    ><path
                        d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"
                    /></svg
                >
            </div>
            <div class="flex gap-2">
                <div class="my-1 h-2.5 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div class="my-1 h-2.5 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>
            <div class="my-1 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <!-- Rank 2 -->
        <div class="flex flex-col items-center justify-center">
            <div class="my-1 h-2.5 w-16 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div class="my-1 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div class="flex h-14 w-14 items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
                <svg
                    width="26"
                    height="26"
                    class="text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                    ><path
                        d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"
                    /></svg
                >
            </div>
            <div class="flex gap-2">
                <div class="my-1 h-2.5 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div class="my-1 h-2.5 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>
            <div class="my-1 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
    </div>
{/if}
