<!--
  @component
  ## Rank component
  Displays the rank of a league from a player
  The rank is displayed in a circle over the image of the player
-->
<script lang="ts">
    import type { RankDto } from '$lib/types'

    export let title: string
    export let rankdata: RankDto
</script>

<div class="text-center text-sm">
    <h3>{title}</h3>
    <h4 class="text-xs">
        {rankdata.rank}
    </h4>
    <h4 class="text-xs">
        {rankdata.lp} LP
    </h4>
    <div class="relative m-auto h-14 w-14 rounded">
        <img src="/images/leagues/{rankdata.image}" alt="rank" />
    </div>
    <p>
        <span class="rounded bg-green-600 px-1 text-white">{rankdata.win}</span>
        <span>{' - '}</span>
        <span class="rounded bg-red-600 px-1 text-white">{rankdata.lose}</span>
    </p>
    <p>{rankdata.winrate}%</p>
</div>
