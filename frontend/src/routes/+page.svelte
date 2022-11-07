<script lang="ts">
    import { AddPlayer, ListPlayers } from '$lib/components'
</script>

<div class="animate__animated animate__fadeIn container m-auto min-h-screen px-4 py-8 lg:py-16">
    <div class="text-center">
        <h1 class="mt-10 mb-5 text-4xl">Welcome to hexastats</h1>

        <hr class="mx-auto md:w-1/2" />

        <div class="my-6">
            <p>A data visualization webapp for League of Legends !</p>
            <p>Search players from multiple servers and start comparing them !</p>
        </div>
    </div>

    <AddPlayer />

    <ListPlayers />

    <div class="relative mx-auto mt-10 h-64 w-64 px-10 opacity-80 md:h-96 md:w-96">
        <img src="/images/programming.svg" alt="Programming" />
    </div>
</div>
