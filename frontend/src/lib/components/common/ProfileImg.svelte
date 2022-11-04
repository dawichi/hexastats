<!--
  @component
  ## Profile Image component
  Displays the level and image of a player
  The level is displayed in a circle over the image of the player
  @param image - the URL to the image
  @param level - the level of the player
  @param margin - the margin of the level circle
-->
<script lang="ts">
    import Image from './Image.svelte'

    export let image: string
    export let level: number = 0
    export let margin: string = 'm-3'
</script>

<div class="relative flex h-14 w-14 flex-col items-center rounded text-sm text-white {margin}">
    <Image {image} />
    <span class="absolute -bottom-2 rounded-full border border-yellow-500 bg-zinc-700 px-1">{level}</span>
</div>
