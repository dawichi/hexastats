<!--
  @component
  ## Profile Items component
  Displays a grid of items of the player
  @param xxxx - aaaaaaaaaa
-->
<script lang="ts">
    import { styles } from '$lib/config'
    import { RiotService } from '$lib/services/Riot.service'

    export let items: Array<number>
    export let ward: number

    const riotService = RiotService.getInstance()
</script>

<div class="flex gap-1">
    <div class="grid grid-cols-3 gap-1">
        {#each [0, 1, 2, 3, 4, 5] as n}
            <span>
                {#if items[n]}
                    <img class="{styles.iconSize.large} rounded" src={riotService.itemURL(items[n])} alt="item" />
                {:else}
                    <div class="{styles.iconSize.large} rounded bg-gradient-to-br from-zinc-500 to-zinc-800" />
                {/if}
            </span>
        {/each}
    </div>
    <img class="{styles.iconSize.large} rounded" src={riotService.itemURL(ward)} alt="item" />
</div>
