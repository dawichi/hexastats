<script lang="ts">
    import type { PlayerDto } from '$lib/types'
    import { SearchPlayer } from '$lib/components'
    import { generalContext } from '$lib/context/general'

    /** @type {import('./$types').PageData} */
    export let data: {
        cachedPlayers: Array<PlayerDto>
    }

    generalContext.update(x => ({ ...x, cachedPlayers: data.cachedPlayers }))
</script>

<div class="animate__animated animate__fadeIn container m-auto lg:py-16">
    <div class="mx-auto w-64 opacity-80 md:w-96">
        <img src="/images/programming.svg" alt="Home" />
    </div>

    <div class="text-center">
        <h1 class="my-5 text-4xl">Welcome to hexastats</h1>

        <hr class="mx-auto md:w-1/2" />

        <div class="my-6">
            <p>Analyze and visualize your League of Legends data !</p>
            <p>Fastest way to check your last games and measure your performance !</p>
        </div>

        <hr class="mx-auto md:w-1/2" />
    </div>

    <SearchPlayer />
</div>
