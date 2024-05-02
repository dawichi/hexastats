<!--
  @component
  ## GameArena
  Game view of Arena gameMode 
  @param game - GameArenaDto
  @param server - string
-->
<script lang="ts">
    import type { GameArenaDto } from '$lib/types'

    import { rawServer, styles } from '$lib/config'
    import { kda, tooltip } from '$lib/utils'
    import { RiotService } from '$lib/services/Riot.service'
    import ItemsGrid from './ItemsGrid.svelte'

    export let game: GameArenaDto
    export let server: string

    const riotService = RiotService.getInstance()

    let groups = [game.participants.slice(0, 2), game.participants.slice(2, 4), game.participants.slice(4, 6), game.participants.slice(6, 8)]

    if (game.participants.length > 8) {
        groups = [
            game.participants.slice(0, 2),
            game.participants.slice(2, 4),
            game.participants.slice(4, 6),
            game.participants.slice(6, 8),
            game.participants.slice(8, 10),
            game.participants.slice(10, 12),
            game.participants.slice(12, 14),
            game.participants.slice(14, 16),
        ]
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
</script>

<div class="animate__animated animate__fadeIn relative col-span-2 flex items-center justify-between px-2 text-center">
    <!-- AUGMENTS -->
    <article class="hidden md:grid grid-cols-2 gap-x-1 gap-y-2">
        {#each game.augments as augment}
            <img
                title={augment.description}
                class="rounded-full bg-black {styles.iconSize.large} rounded"
                src={riotService.augmentURL(augment.iconLarge)}
                alt="item"
                use:tooltip
            />
        {/each}
    </article>

    <!-- KDA, PLACEMENT -->
    <article>
        <p><strong class="sm:hidden">{game.kills} / {game.deaths} / {game.assists}</strong></p>
        <p><strong>{kda(game.kills, game.deaths, game.assists)}</strong> KDA</p>
        <p class="text-3xl"><strong>{game.placement}</strong>º</p>
    </article>

    <!-- ITEMS -->
    <article class="hidden sm:flex flex-col">
        <p>{game.kills} / {game.deaths} / {game.assists}</p>
        <ItemsGrid items={game.items} ward={game.ward} />
    </article>

    <!-- LIST OF SUMMONERS YOU PLAYED WITH -->
    <div class="{groups.length > 4 ? 'columns-4' : 'columns-2'} px-1">
        {#each groups as group, idx1}
            <div class="py-2">
                {#each group as participant, idx2}
                    <div class="flex items-center">
                        {#if participant.riotIdTagLine}
                            <a href={`/summoners/${rawServer(server)}/${participant.riotIdGameName}-${participant.riotIdTagLine}/1`}>
                                <img class="{styles.iconSize.medium} rounded" src={riotService.champImage(participant.championName)} alt="champion" />
                            </a>
                            <span
                                class="{group.length > 4
                                    ? 'md:block md:truncate md:ml-1 md:h-5 md:w-14 lg:w-10 md:text-ellipsis'
                                    : 'lg:block lg:truncate lg:ml-1 lg:h-5 lg:w-16 lg:text-ellipsis'} hidden overflow-hidden whitespace-nowrap text-left text-sm"
                            >
                                <a
                                    href={`/summoners/${rawServer(server)}/${participant.riotIdGameName}-${participant.riotIdTagLine}/1`}
                                    class="hover:underline {participant.riotIdGameName === game.participants[game.participantNumber].riotIdGameName
                                        ? 'font-bold'
                                        : ''}"
                                    on:click={scrollToTop}
                                >
                                    {participant.riotIdGameName}
                                </a>
                            </span>
                        {:else}
                            <img class="{styles.iconSize.medium} rounded" src={riotService.champImage(participant.championName)} alt="champion" />
                            <span
                                class="hidden md:block md:truncate md:ml-1 md:h-5 md:w-20 overflow-hidden md:text-ellipsis whitespace-nowrap text-left text-sm"
                            >
                                <p class={participant.riotIdGameName === game.participants[game.participantNumber].riotIdGameName ? 'font-bold' : ''}>
                                    {participant.riotIdGameName}
                                </p>
                            </span>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
