<script lang="ts">
    import '../app.css'
    import { styles } from '$lib/config/styles'
    import { Footer, Navbar } from '$lib/components'
    import { navigating } from '$app/stores'
    import Spinner from '$lib/components/common/Spinner.svelte'
</script>

<div class="flex h-screen flex-col">
    <header>
        <Navbar />
    </header>

    <main class="flex-grow pb-20 dark:text-white {styles.background}">
        <!-- <ListPlayersHeader /> -->

        {#if $navigating}
            {#if $navigating?.to?.url.pathname.includes('summoners')}
                <Spinner />
                <h1 class="text-center text-2xl">Getting data for: <br /> {decodeURI($navigating?.to?.url.pathname.split('/')[3])}</h1>
            {/if}
        {:else}
            <slot />
        {/if}
    </main>

    <Footer />
</div>

<style>
    header {
        position: sticky;
        top: 0;
        z-index: 1;
    }
</style>
