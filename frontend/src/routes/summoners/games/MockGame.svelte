<!--
  @component
  ## Mock Game
  Display a mock game
-->
<script lang="ts">
    import { styles } from '$lib/config'
    import { MockImage } from '$lib/components'

    const mockUpStyle = 'rounded-full bg-zinc-400 dark:bg-zinc-800'
</script>

<div class="{styles.background} {styles.card} mx-4 my-2 grid h-36 w-full animate-pulse grid-cols-3">
    <!-- Champ Image -->
    <div class="relative h-full">
        <MockImage height="h-full" width="w-full" />
        <div class="absolute top-2 left-2">
            <div class="my-1 h-2.5 w-20 {mockUpStyle}" />
            <div class="my-1 h-2.5 w-24 {mockUpStyle}" />
        </div>
        <div class="absolute bottom-2 left-2">
            <div class="my-1 h-2.5 w-20 {mockUpStyle}" />
        </div>
        <div class="absolute bottom-2 right-2">
            <div class="my-1 h-2.5 w-20 {mockUpStyle}" />
        </div>
    </div>

    <!-- Items -->
    <div class="relative flex flex-col items-center text-center">
        <div class="absolute top-1 bottom-1 left-3">
            <div class="flex h-full flex-col justify-around">
                <MockImage height="h-10" width="w-10" />
                <MockImage height="h-10" width="w-10" />
                <MockImage height="h-10" width="w-10" />
            </div>
        </div>
        <div class="mt-2 flex gap-4">
            <div class="my-1 h-2.5 w-16 {mockUpStyle}" />
            <div class="my-1 h-2.5 w-12 {mockUpStyle}" />
        </div>
        <div class="mt-4 ml-4">
            <div class="grid grid-cols-3 gap-2">
                {#each [0, 1, 2, 3, 4, 5] as _}
                    <MockImage height="h-10" width="w-10" />
                {/each}
            </div>
        </div>
    </div>

    <!-- Items -->
    <div class="grid grid-cols-2 p-1">
        {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as _}
            <div class="flex items-center pl-2">
                <MockImage height="h-6" width="w-6" />
                <div class="ml-1 h-2.5 w-12 {mockUpStyle}" />
            </div>
        {/each}
    </div>
</div>
