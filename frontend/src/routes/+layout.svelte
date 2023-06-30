<script lang="ts">
    import '../app.css'
    import { styles } from '$lib/config/styles'
    import { Footer, Navbar } from '$lib/components'
</script>

<div class="flex h-screen flex-col">
    <header>
        <Navbar />
    </header>

    <main class="flex-grow pb-20 dark:text-white {styles.background}">
        <slot />
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
