<!--
  @component
  ## GameCollapsed
  Game view when not expanded
  @param game - GameDto
  @param server - string
-->
<script lang="ts">
    import type { GameDto } from '$lib/types'

    import { rawServer, styles } from '$lib/config'
    import { kda } from '$lib/utils'
    import { RiotService } from '$lib/services/Riot.service'

    const riotService = RiotService.getInstance()

    export let game: GameDto
    export let server: string
</script>

<div class="animate__animated animate__fadeIn relative col-span-2 flex items-center justify-between px-2 text-center">
    <!-- SPELLS, RUNES -->
    <article class="grid grid-cols-2 gap-x-1 gap-y-2">
        {#each [game.spells[0], game.perks[1], game.spells[1], game.perks[0]] as src}
            <img class="{styles.iconSize.large} rounded" {src} alt="spell 2" />
        {/each}
    </article>

    <!-- KDA, CS, VISION -->
    <article>
        <p><strong>{kda(game.kda.kills, game.kda.deaths, game.kda.assists)}</strong> KDA</p>
        <p><strong>{game.cs}</strong> CS</p>
        <p><strong>{((game.cs * 60) / game.gameDuration).toFixed(1)}</strong> cs/min</p>
        <p><strong>{game.visionScore}</strong> vision</p>
    </article>

    <!-- ITEMS -->
    <article class="hidden flex-col sm:flex">
        <p>{game.kda.kills} / {game.kda.deaths} / {game.kda.assists}</p>
        <div class="mt-2 flex gap-1">
            <div class="grid grid-cols-3 gap-1">
                {#each [0, 1, 2, 3, 4, 5] as itemId}
                    <span>
                        {#if game.items[itemId]}
                            <img class="{styles.iconSize.large} rounded" src={game.items[itemId]} alt="item" />
                        {:else}
                            <div class="{styles.iconSize.large} rounded bg-gradient-to-br from-zinc-500 to-zinc-800" />
                        {/if}
                    </span>
                {/each}
            </div>
            <img class="{styles.iconSize.large} rounded" src={game.ward} alt="item" />
        </div>
    </article>

    <!-- LIST OF SUMMONERS YOU PLAYED WITH -->
    <div class="hidden columns-2 p-1 lg:block">
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
