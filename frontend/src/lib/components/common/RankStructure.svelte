<!--
  @component
  ## Rank Structure component
  Display an image using `background-image` instead of `<img/>`
  @param player - the player data to display
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import ProfileImg from './ProfileImg.svelte'
    import Rank from './Rank.svelte'

    export let player: SummonerDto
</script>

<div class="flex items-center justify-center gap-4">
    <div class="flex flex-col items-center justify-center overflow-hidden">
        <ProfileImg image={player.image} level={player.level} />
        <h2 class="mt-2 text-xl">{player.alias && player.alias}</h2>
    </div>
    <Rank title={'Solo/Duo'} rankdata={player.rank.solo} />
    <Rank title={'Flex'} rankdata={player.rank.flex} />
</div>
