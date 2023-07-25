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
    
    const groups = [
        game.participants.slice(0, 2),
        game.participants.slice(2, 4),
        game.participants.slice(4, 6),
        game.participants.slice(6, 8),
    ]
</script>

<div class="animate__animated animate__fadeIn relative col-span-2 flex items-center justify-between px-2 text-center">
    <!-- AUGMENTS -->
    <article class="grid grid-cols-2 gap-x-1 gap-y-2">
        {#each game.augments as augment}
            <img title="{augment.description}" class="rounded-full bg-black {styles.iconSize.large} rounded" src={riotService.augmentURL(augment.iconLarge)} alt="item" use:tooltip />
        {/each}
    </article>

    <!-- KDA, PLACEMENT -->
    <article>
        <p><strong>{kda(game.kills, game.deaths, game.assists)}</strong> KDA</p>
        <p class="text-3xl"><strong>{game.placement}</strong>º</p>
    </article>

    <!-- ITEMS -->
    <article class="hidden flex-col sm:flex">
        <p>{game.kills} / {game.deaths} / {game.assists}</p>
        <ItemsGrid items={game.items} ward={game.ward} />
    </article>

    <!-- LIST OF SUMMONERS YOU PLAYED WITH -->
    <div class="columns-2 px-1">
        {#each groups as group, idx1}
        <div class="py-2">
            {#each group as participant, idx2}
            <div class="flex items-center">
                <img class="{styles.iconSize.medium} rounded" src={riotService.champImage(participant.championName)} alt="champion" />
                <span class="ml-1 h-5 w-20 overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm">
                    <a
                        href={`/summoners/${rawServer(server)}/${participant.summonerName}`}
                        class="hover:underline {participant.summonerName === game.participants[game.participantNumber].summonerName ? 'font-bold' : ''}"
                    >
                        {participant.summonerName}
                    </a>
                </span>
            </div>
            {/each}
        </div>
        {/each}
    </div>
</div>
