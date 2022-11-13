<script lang="ts">
    import '../app.css'
    import { styles } from '$lib/config/styles'
    import { Footer, ListPlayersHeader, Navbar } from '$lib/components'
</script>

<header>
    <Navbar />
</header>

<main class="pb-20 dark:text-white min-h-screen {styles.background}">
    <ListPlayersHeader />
    <slot />
</main>

<Footer />

<style>
    header {
        position: sticky;
        top: 0;
        z-index: 1;
    }
</style>
