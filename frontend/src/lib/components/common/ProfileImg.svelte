<!--
  @component
  ## Profile Image component
  Displays the level and image of a player
  The level is displayed in a circle over the image of the player
  @param image - the URL to the image
  @param level - the level of the player
  @param margin - the margin of the level circle
  @param size - the height and width of the image. Default: 'h-14 w-14'
-->
<script lang="ts">
    export let image: string
    export let level: number = 0
    export let margin: string = 'm-3'
    export let size: string = 'h-14 w-14'
</script>

<div class="relative flex {size} flex-col items-center rounded text-sm text-white {margin}">
    <img class="rounded" src={image} alt="profile pic" />
    <span class="absolute -bottom-2 rounded-full border border-yellow-500 bg-zinc-700 px-1">{level}</span>
</div>
