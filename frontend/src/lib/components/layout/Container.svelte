<!--
  @component
  ## Container component
  Displays the content centered with a title and a subtitle
-->
<script lang="ts">
    export let title: string = ''
    export let description: string = ''
    export let disableHeader: boolean = false
</script>

<div class="animate__animated animate__fadeIn">
    <div class="container mx-auto px-2 py-5">
        {#if !disableHeader}
            <div>
                <h1 class="mt-10 text-center text-4xl">{title}</h1>
                <br />
                <p class="text-center">{description}</p>
                <br />
                <hr />
                <br />
            </div>
        {/if}
        <slot />
    </div>
</div>
