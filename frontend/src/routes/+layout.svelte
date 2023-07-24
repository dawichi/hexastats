<script lang="ts">
    import '../app.css'
    import { styles } from '$lib/config/styles'
    import { Footer, Navbar, Spinner } from '$lib/components'
    import { cachedPlayersContext, hexastatsCrashedContext } from '$lib/context/general'
    import { navigating } from '$app/stores'

    export let data

    cachedPlayersContext.set(data.cachedPlayers)
    hexastatsCrashedContext.set(data.error)
</script>

<div class="flex h-screen flex-col">
    <header>
        <Navbar />
    </header>

    <main class="flex-grow pb-20 dark:text-white {styles.background}">
        {#if data.error}
            <div class="mx-auto px-4 py-24 text-center lg:p-8">
                <h1 class="text-3xl">
                    Hexastats is currently in maintenance <i class="bi bi-tools" />
                </h1>
                <p>Please, wait a few minutes until our team finish the update!</p>
            </div>
        {:else if $navigating?.from?.url.pathname === '/' && $navigating?.to?.url.pathname.includes('summoners')}
            <Spinner />
            <h1 class="text-center text-2xl">Getting data for: <br /> {decodeURI($navigating?.to?.url.pathname.split('/')[3])}</h1>
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
