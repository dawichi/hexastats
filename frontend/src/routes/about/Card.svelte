<!--
  @component
  ## Card component for About page
  Display the information of a contributor
-->
<script lang="ts">
    import { Image } from '$lib/components'
    import type { ContributorDto } from './contributor.dto'

    export let contributor: ContributorDto
</script>

<div class="relative flex h-full flex-col justify-between rounded-lg bg-white shadow dark:bg-zinc-800">
    <div class="absolute left-0 top-0 h-24 w-full rounded-t-lg bg-indigo-400" />
    <span class="absolute top-2 left-2 text-white">{contributor.company}</span>
    <span class="absolute top-2 right-2 text-white">
        <a title="See project" href={'https://github.com/' + contributor.alias} target="_blank" rel="noreferrer">
            <i class="bi bi-github" />
        </a>
    </span>

    <!-- Image -->
    <section class="relative top-0 left-0 mx-auto h-32 w-32 pt-8">
        <div class="absolute h-32 w-32 overflow-hidden rounded-full shadow">
            <Image src={contributor.image} />
        </div>
    </section>

    <!-- Name -->
    <a href={contributor.url} target="_blank" rel="noreferrer">
        <section class="mt-10 px-4">
            <p class="text-xl">{contributor.name}</p>
            <p class="text-md text-zinc-400">@{contributor.alias}</p>
            <p class="pt-2">{contributor.bio}</p>
            <p class="text-md text-zinc-400">{contributor.location}</p>
        </section>
    </a>

    <!-- Stats -->
    <section class="mx-8 my-3 grid grid-cols-3 rounded border-0 border-t-2 border-indigo-400 p-3 shadow-md dark:shadow-zinc-700">
        <div>
            <p class="text-xl">{contributor.followers}</p>
            <p class="text-xs text-zinc-400">Followers</p>
        </div>
        <div>
            <p class="text-xl">{contributor.following}</p>
            <p class="text-xs text-zinc-400">Following</p>
        </div>
        <div>
            <p class="text-xl">{contributor.public_repos}</p>
            <p class="text-xs text-zinc-400">Repositories</p>
        </div>
    </section>
</div>
