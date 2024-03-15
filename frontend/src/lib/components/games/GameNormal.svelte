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
    
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
</script>

<div class="animate__animated animate__fadeIn relative col-span-2 flex items-center justify-between px-2 text-center">
    <!-- SPELLS, RUNES -->
    <article class="hidden md:grid grid-cols-2 gap-x-1 gap-y-2">
        {#each [riotService.spellUrl(game.spells[0]), game.perks.primary, riotService.spellUrl(game.spells[1]), game.perks.secondary] as src}
            <img class="{styles.iconSize.large} rounded" {src} alt="spell 2" />
        {/each}
    </article>

    <!-- KDA, CS, VISION -->
    <article>
        <p><strong class="sm:hidden">{game.kills} / {game.deaths} / {game.assists}</strong></p>
        <p><strong>{kda(game.kills, game.deaths, game.assists)}</strong> KDA</p>
        <p><strong>{game.cs}</strong> CS</p>
        <p><strong>{((game.cs * 60) / game.gameDuration).toFixed(1)}</strong> cs/min</p>
        <p><strong>{game.visionScore}</strong> vision</p>
    </article>

    <!-- ITEMS -->
    <article class="hidden sm:flex flex-col">
        <p>{game.kills} / {game.deaths} / {game.assists}</p>
        <ItemsGrid items={game.items} ward={game.ward} />
    </article>

    <!-- LIST OF SUMMONERS YOU PLAYED WITH -->
    <div class="columns-2 p-1">
        {#each game.participants as participant, idx}
            <span class="flex items-center">
                {#if participant.riotIdTagLine}
                    <a href={`/summoners/${rawServer(server)}/${participant.riotIdGameName}-${participant.riotIdTagLine}/1`}>
                        <img class="{styles.iconSize.medium} rounded" src={riotService.champImage(participant.championName)} alt="champion" />
                    </a>
                    <span class="hidden md:block md:truncate md:ml-1 md:h-5 md:w-20 overflow-hidden md:text-ellipsis whitespace-nowrap text-left text-sm">
                        <a
                            href={`/summoners/${rawServer(server)}/${participant.riotIdGameName}-${participant.riotIdTagLine}/1`}
                            class="hover:underline {game.participantNumber === idx ? 'font-bold' : ''}"
                            on:click={scrollToTop}
                        >
                            {participant.riotIdGameName}
                        </a>
                    </span>
                {:else}
                    <img class="{styles.iconSize.medium} rounded" src={riotService.champImage(participant.championName)} alt="champion" />
                    <span class="hidden md:block md:truncate md:ml-1 md:h-5 md:w-20 overflow-hidden md:text-ellipsis whitespace-nowrap text-left text-sm">
                        <p class={game.participantNumber === idx ? 'font-bold' : ''}>
                            {participant.riotIdGameName}
                        </p>
                    </span>
                {/if}
            </span>
        {/each}
    </div>
</div>
