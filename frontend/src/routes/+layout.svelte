<script lang="ts">
    import '../app.css'
    import { styles } from '$lib/config/styles'
    import { Footer, Navbar } from '$lib/components'
    import { cachedPlayersContext, hexastatsCrashedContext } from '$lib/context/general'

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
            <div class="px-4 py-24 lg:p-8 mx-auto text-center">
                <h1 class="text-3xl">
                    Hexastats is currently in maintenance <i class="bi bi-tools"></i>
                </h1>
                <p>Please, wait a few minutes until our team finish the update!</p>
            </div>
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
