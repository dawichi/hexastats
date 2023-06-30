<!--
  @component
  ## Button
  Display button with loading state
  @param onClick - function to execute on click
  @param isLoading - boolean to show loading state
-->
<script lang="ts">
    export let onClick: () => void
    export let isLoading = false
</script>

<button on:click={onClick} class="mt-2 block w-36 rounded bg-indigo-500 px-2 text-white hover:bg-indigo-600">
    {#if isLoading}
        <i class="bi bi-arrow-clockwise animate block animate-spin" />
    {:else}
        <slot />
    {/if}
</button>
