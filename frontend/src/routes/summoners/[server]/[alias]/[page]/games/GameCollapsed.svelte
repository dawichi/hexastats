<!--
  @component
  ## GameCollapsed
  Game view when not expanded
  @param game - GameDto
  @param server - string
-->
<script lang="ts">
    import type { GameArenaDto, GameDto, GameNormalDto } from '$lib/types'

    import { rawServer, styles } from '$lib/config'
    import { kda } from '$lib/utils'
    import { RiotService } from '$lib/services/Riot.service'

    export let game: GameNormalDto | GameArenaDto
    export let server: string
    
    const riotService = RiotService.getInstance()

    // Type guard
    const isGameNormal = (data: GameNormalDto | GameArenaDto): data is GameNormalDto => 'perks' in data
</script>

<div class="animate__animated animate__fadeIn relative col-span-2 flex items-center justify-between px-2 text-center">
    <!-- SPELLS, RUNES -->
    <article class="grid grid-cols-2 gap-x-1 gap-y-2">
        {#if isGameNormal(game)}
            {#each [riotService.spellUrl(game.spells[0]), game.perks[1], riotService.spellUrl(game.spells[1]), game.perks[0]] as src}
                <img class="{styles.iconSize.large} rounded" {src} alt="spell 2" />
            {/each}
        {:else}
            {#each game.augments as augment}
                <img class="{styles.iconSize.large} rounded" src={riotService.augmentURL(augment.iconLarge)} alt="item" />
            {/each}
        {/if}
    </article>

    <!-- KDA, CS, VISION -->
    <article>
        <p><strong>{kda(game.kills, game.deaths, game.assists)}</strong> KDA</p>
        <p><strong>{game.cs}</strong> CS</p>
        <p><strong>{((game.cs * 60) / game.gameDuration).toFixed(1)}</strong> cs/min</p>
        <p><strong>{game.visionScore}</strong> vision</p>
    </article>

    <!-- ITEMS -->
    <article class="hidden flex-col sm:flex">
        <p>{game.kills} / {game.deaths} / {game.assists}</p>
        <div class="mt-2 flex gap-1">
            <div class="grid grid-cols-3 gap-1">
                {#each [0, 1, 2, 3, 4, 5] as n}
                    <span>
                        {#if game.items[n]}
                            <img class="{styles.iconSize.large} rounded" src={riotService.itemURL(game.items[n])} alt="item" />
                        {:else}
                            <div class="{styles.iconSize.large} rounded bg-gradient-to-br from-zinc-500 to-zinc-800" />
                        {/if}
                    </span>
                {/each}
            </div>
            <img class="{styles.iconSize.large} rounded" src={riotService.itemURL(game.ward)} alt="item" />
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
