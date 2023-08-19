<script lang="ts">
    import { Container } from '$lib/components'
    import Image from '$lib/components/common/Image.svelte'
    import Card from './Card.svelte'
    import type { ContributorDto } from './contributor.dto'

    /** @type {import('./$types').PageServerLoad} */
    export let data: {
        contributors: ContributorDto[]
    }
</script>

<Container title="About us" description={'Who is behind hexastats?'}>
    <div class="grid grid-cols-2 xl:grid-cols-4">
        <div class="col-span-3 mx-auto px-10 text-center">
            <p class="mb-5">
                Hi! We are a small group of friends who wanted a way to easily compare ourselves instead of just checking out our respective opgg pages.
            </p>
            <p class="mb-5">After some research, we coded a simple script to get some basic info about our overall stats of our League of Legeds users.</p>
            <p class="mb-5">
                Eventually, because most people thought it could be a cool tool and wanted to try their usernames in the script, I decided to transform the idea
                into a web app with search system, so anyone could add themselves and their friends to make comparisons and have fun.
            </p>
            <p class="mb-5">Right now we keep working on it to improve it, adding new cool sections and new ways to interact with the data.</p>
        </div>
        <div class="relative mx-auto h-48 w-80">
            <Image src="/images/gifs/coding.gif" />
        </div>
    </div>

    <p class="mt-16 mb-5 text-xl">The main plans are:</p>
    <ul>
        <li>🕑 Improve the time it takes to load the data from a player, by more than 90%</li>
        <li>🎮 Load automatically all players in a game when you enter in a new match</li>
    </ul>

    <div class="mt-20 text-center">
        <h2 class="text-2xl">Creators</h2>
        <hr class="mt-5" />
        <p class="my-5">Feel free to contact us through our GitHub!</p>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {#each data.contributors as contributor}
                <Card {contributor} />
            {/each}
        </div>
    </div>

    <div class="mt-20 text-center">
        <h2 class="text-2xl">Contribute</h2>
        <hr class="mt-5" />
        <p class="my-5">Do you want to contribute to Hexastats?</p>
        <p class="my-5">
            Hexastats is Open Source and therefore you have the source code available via <a
                class="text-blue-500"
                href="https://github.com/dawichi/hexastats"
                target="_blank"
                rel="noreferrer">github.com/dawichi/hexastats</a
            >.
        </p>
        <p>
            if you want to help us or propose new ideas, contact us through github or by creating an issue in <a
                class="text-blue-500"
                href="https://github.com/dawichi/hexastats/issues/new"
                target="_blank"
                rel="noreferrer">here</a
            >!
        </p>
    </div>

    <div class="relative mx-auto mt-10 h-80 w-80">
        <Image src="/images/gifs/peter.gif" />
    </div>
</Container>
