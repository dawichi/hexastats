<script lang="ts">
    import '../app.css'
    import { styles } from '$lib/config/styles'
    import { Footer, ListPlayersHeader, Navbar } from '$lib/components'
    import { navigating } from '$app/stores'
</script>

<header>
    <Navbar />
</header>

<main class="min-h-screen pb-20 dark:text-white {styles.background}">
    <ListPlayersHeader />
    <a href="/summoners/euw/dawichii">dawichii</a>
    <a href="/summoners/euw/alexwwe">alexwwe</a>
    {#if $navigating}
        <h1 class="text-3xl text-center">Fetchinggggg</h1>
        <p>from: {$navigating.from?.url}</p>
        <p>to: {$navigating.to?.url}</p>
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
