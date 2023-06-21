<!--
  @component
  ## GameExpanded
  Game view when expanded
  @param game - GameDto
  @param server - string
-->
<script lang="ts">
    import type { GameDto } from '$lib/types'

    import { rawServer, styles } from '$lib/config'
    import { RiotService } from '$lib/services/Riot.service'
    import { kda, parse_k_num, tooltip } from '$lib/utils'

    export let game: GameDto
    export let server: string

    const MAX_DMG_DEALT = Math.max(...game.participants.map(participant => participant.champ.damageDealt))
    const MAX_DMG_TAKEN = Math.max(...game.participants.map(participant => participant.champ.damageTaken))
</script>


<div class="animate__animated animate__fadeIn col-span-2 flex flex-col justify-around overflow-hidden rounded-lg bg-white dark:bg-zinc-900">
    {#each game.participants as participant, idx}
        <div class="flex h-full items-center border-y border-t-0 border-zinc-700 {idx < 5 ? 'bg-blue-400/30' : 'bg-red-400/30'}">
            <div class="relative">
                <img class="{styles.iconSize.large} mx-1 rounded" src={RiotService.champImage(participant.champ.championName)} alt="champion" />
                <span class="absolute top-0 rounded-lg bg-zinc-700 text-xs">{participant.champ.champLevel}</span>
            </div>

            <div class="grid grid-cols-2">
                <div class="flex flex-col">
                    <img class="{styles.iconSize.small} rounded" src={participant.spells[0]} alt="spell 2" />
                    <img class="h-[16px] w-[16px] rounded" src={participant.spells[1]} alt="spell 1" />
                </div>
                <div class="flex flex-col">
                    <img class="{styles.iconSize.small} rounded" src={participant.perks[1]} alt="main runes" />
                    <img class="{styles.iconSize.small} rounded" src={participant.perks[0]} alt="secondary runes" />
                </div>
            </div>

            <div class="ml-1 h-5 w-20 overflow-hidden text-ellipsis whitespace-nowrap text-sm ">
                <a href={`/summoners/${rawServer(server)}/${participant.summonerName}`} class="hover:underline">
                    {participant.summonerName}
                </a>
            </div>

            <div class="ml-2 grid w-16 grid-rows-2 text-xs">
                <span class="whitespace-nowrap">{participant.kda.kills} / {participant.kda.deaths} / {participant.kda.assists}</span>
                <span>{kda(participant.kda.kills, participant.kda.deaths, participant.kda.assists)} kda</span>
            </div>

            <!-- DAMAGE DEALT -->
            <div class="flex flex-col items-center">
                <span class="text-xs">{parse_k_num(participant.champ.damageDealt)}</span>
                <div class="ml-2 h-2 w-20 rounded bg-zinc-300 dark:bg-zinc-600">
                    <div
                        title="Damage dealt: {participant.champ.damageDealt}"
                        class="h-2 rounded bg-red-400"
                        style="width: {(participant.champ.damageDealt / MAX_DMG_DEALT) * 100}%"
                        use:tooltip
                    />
                </div>
            </div>

            <!-- DAMAGE TAKEN -->
            <div class="flex flex-col items-center">
                <span class="text-xs">{parse_k_num(participant.champ.damageTaken)}</span>
                <div class="ml-2 h-2 w-20 rounded bg-zinc-300 dark:bg-zinc-600">
                    <div
                        title="Damage taken: {participant.champ.damageTaken}"
                        class="h-2 rounded bg-blue-400"
                        style="width: {(participant.champ.damageTaken / MAX_DMG_TAKEN) * 100}%"
                        use:tooltip
                    />
                </div>
            </div>

            <!-- items of each player -->
            <div class="ml-2 grid grid-cols-7">
                {#each [0, 1, 2, 3, 4, 5] as itemId}
                    <span>
                        {#if participant.items[itemId]}
                            <img class="{styles.iconSize.large} ml-1 rounded" src={participant.items[itemId]} alt="item" />
                        {:else}
                            <div class="{styles.iconSize.large} ml-1 rounded bg-gradient-to-br from-zinc-500 to-zinc-800" />
                        {/if}
                    </span>
                {/each}
                <img class="{styles.iconSize.large} ml-1 rounded" src={participant.ward} alt="guard" />
            </div>
        </div>
    {/each}
</div>
