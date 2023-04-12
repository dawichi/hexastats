<script lang="ts">
    import '../app.css'
    import { styles } from '$lib/config/styles'
    import { Footer, Navbar } from '$lib/components'
    import { navigating } from '$app/stores'
    import { generalContext } from '$lib/context/general'
    
    /** @type {import('./$types').PageData} */
    export let data: {
        version: string
    }

    generalContext.update(x => ({ ...x, version: data.version }))
</script>

<header>
    <Navbar />
</header>

<main class="min-h-screen pb-20 dark:text-white {styles.background}">
    <!-- <ListPlayersHeader /> -->

    {#if $navigating}
        {#if $navigating?.to?.url.pathname.includes('summoners')}
            <div class="flex items-center justify-center">
                <i class="bi bi-arrow-clockwise my-12 animate-spin text-6xl" />
            </div>
            <h1 class="text-center text-2xl">Getting data for: <br /> {decodeURI($navigating?.to?.url.pathname.split('/')[3])}</h1>
        {/if}
    {:else}
        <slot />
    {/if}
</main>

<Footer />

<style>
    header {
        position: sticky;
        top: 0;
        z-index: 1;
    }
</style>
