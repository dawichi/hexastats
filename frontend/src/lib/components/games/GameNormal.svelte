<!--
  @component
  ## GameCollapsed
  Game view for 5 Vs 5 games
  @param game - GameNormalDto
  @param server - string
-->
<script lang="ts">
    import type { GameNormalDto } from '$lib/types'

    import { rawServer, styles } from '$lib/config'
    import { kda } from '$lib/utils'
    import { RiotService } from '$lib/services/Riot.service'
    import ItemsGrid from './ItemsGrid.svelte'

    export let game: GameNormalDto
    export let server: string

    const riotService = RiotService.getInstance()
</script>

<div class="animate__animated animate__fadeIn relative col-span-2 flex items-center justify-between px-2 text-center">
    <!-- SPELLS, RUNES -->
    <article class="grid grid-cols-2 gap-x-1 gap-y-2">
        {#each [riotService.spellUrl(game.spells[0]), game.perks[1], riotService.spellUrl(game.spells[1]), game.perks[0]] as src}
            <img class="{styles.iconSize.large} rounded" {src} alt="spell 2" />
        {/each}
    </article>

    <!-- KDA, CS, VISION -->
    <article>
        <p><strong>{kda(game.kills, game.deaths, game.assists)}</strong> KDA</p>
        <p><strong>{game.cs}</strong> CS</p>
        <p><strong>{((game.cs * 60) / game.gameDuration).toFixed(1)}</strong> cs/min</p>
        <p><strong>{game.visionScore}</strong> vision</p>
    </article>

    <!-- ITEMS -->
    <article class="flex flex-col">
        <p>{game.kills} / {game.deaths} / {game.assists}</p>
        <ItemsGrid items={game.items} ward={game.ward} />
    </article>

    <!-- LIST OF SUMMONERS YOU PLAYED WITH -->
    <div class="columns-2 p-1">
        {#each game.participants as participant, idx}
            <span class="flex items-center">
                <img class="{styles.iconSize.medium} rounded" src={riotService.champImage(participant.championName)} alt="champion" />
                <span class="ml-1 h-5 w-20 overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm">
                    <a
                        href={`/summoners/${rawServer(server)}/${participant.summonerName}`}
                        class="hover:underline {game.participantNumber === idx ? 'font-bold' : ''}"
                    >
                        {participant.summonerName}
                    </a>
                </span>
            </span>
        {/each}
    </div>
</div>