<!--
  @component
  ## Game component
  Display a game row
-->
<script lang="ts">
    import type { ParticipantDto } from '$lib/types/player/Game.dto'
    import type { GameDto } from '$lib/types'

    import { styles } from '$lib/config'
    import { RiotService } from '$lib/services/Riot.service'
    import SummonersGrid from './SummonersGrid.svelte'
    import { classNames, parse_k_num } from '$lib/utils'
    import { formatDate } from '$lib/utils/formatDate'

    export let game: GameDto
    export let participant: ParticipantDto

    let expanded = false

    const MAX_DMG_DEALT = Math.max(...game.participants.map(participant => participant.champ.damageDealt))
    const MAX_DMG_TAKEN = Math.max(...game.participants.map(participant => participant.champ.damageTaken))

    const calc_kda = (kills: number, deaths: number, assists: number) => (deaths ? ((kills + assists) / deaths).toFixed(1) : kills + assists)

    function rowStyle(game: GameDto, participant: ParticipantDto): string {
        if (game.gameDuration < 300) {
            return 'border-zinc-500 bg-zinc-500/20 dark:bg-zinc-500/20'
        }
        return participant.win ? 'border-green-500 bg-green-500/20 dark:bg-green-500/20' : 'border-red-500 bg-red-500/20 dark:bg-red-500/20'
    }

    function cardShadow(game: GameDto, participant: ParticipantDto): string {
        if (game.gameDuration < 300) {
            return `${styles.shadow}`
        }
        return participant.win ? `${styles.shadowwin}` : `${styles.shadowlose}`
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
    class={classNames(
        `${styles.background} ${styles.shadow},`, // base style
        `transition ${expanded ? 'h-96' : 'h-32'}`, //expandable
        'mx-2 cursor-pointer rounded-lg', //adjustment
        cardShadow(game, participant), //card shadow color styles
    )}
    on:click={() => (expanded = !expanded)}
>
    <div
        class={classNames(
            `transition ${expanded ? 'h-96' : 'h-32'}`, //expandable
            'grid grid-cols-3 rounded-lg border-8 border-y-0 border-r-0', //adjustment
            rowStyle(game, participant), //row color
        )}
    >
        <!-- [Left,_,_] block -->
        <div class="relative text-xs text-white sm:text-base">
            <div
                class="t-0 l-0 absolute h-full w-full bg-cover bg-top"
                style="background-image: url({RiotService.champSplash(participant.champ.championName)})"
            />
            <div class="t-0 l-0 absolute h-full w-full" style="background-image: linear-gradient(to top right, #000000bd , #ffffff00)" />
            <div class="absolute top-2 left-3">
                <img src={RiotService.teamPositionIcon(participant.teamPosition)} alt="champ" style="width: 42px; height: 42px;" />
            </div>
            <span class="absolute top-3 left-14 text-center text-xl">{participant.champ.champLevel}</span>
            <span class="absolute bottom-1 left-2 sm:text-sm">{formatDate(game.gameCreation, game.gameDuration)}</span>
            <span class="absolute bottom-5 left-2">{game.gameMode}</span>
            <span class="absolute bottom-1 right-2">
                {(game.gameDuration / 60).toFixed(0)}:{(game.gameDuration % 60).toFixed(0).padStart(2, '0')}
            </span>
        </div>

        <!-- [_,Center,Right] block -->
        {#if !expanded}
            <div class="animate__animated animate__fadeIn relative col-span-2 flex items-center justify-between px-2 text-center">
                <article class="grid grid-cols-2 gap-x-1 gap-y-2">
                    {#each [participant.spells[0], participant.perks[1], participant.spells[1], participant.perks[0]] as src}
                        <img class="{styles.iconSize.large} rounded" {src} alt="spell 2" />
                    {/each}
                </article>

                <article>
                    <p><strong>{calc_kda(participant.kda.kills, participant.kda.deaths, participant.kda.assists)}</strong> KDA</p>
                    <p><strong>{participant.farm.cs}</strong> CS</p>
                    <p><strong>{((participant.farm.cs * 60) / game.gameDuration).toFixed(1)}</strong> cs/min</p>
                    <p><strong>{participant.visionScore}</strong> vision</p>
                </article>

                <article class="hidden flex-col sm:flex">
                    <p>{participant.kda.kills} / {participant.kda.deaths} / {participant.kda.assists}</p>
                    <div class="mt-2 flex gap-1">
                        <div class="grid grid-cols-3 gap-1">
                            {#each [0, 1, 2, 3, 4, 5] as itemId}
                                <span>
                                    {#if participant.items[itemId]}
                                        <img class="{styles.iconSize.large} rounded" src={participant.items[itemId]} alt="item" />
                                    {:else}
                                        <div class="{styles.iconSize.large} rounded bg-gradient-to-br from-zinc-500 to-zinc-800" />
                                    {/if}
                                </span>
                            {/each}
                        </div>
                        <img class="{styles.iconSize.large} rounded" src={participant.ward} alt="item" />
                    </div>
                </article>

                <div class="hidden lg:block">
                    <SummonersGrid {game} />
                </div>
            </div>
        {:else}
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
                        <span class="ml-1 h-5 w-20 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                            {participant.summonerName}
                        </span>

                        <div class="ml-2 grid w-16 grid-rows-2 text-xs">
                            <span>{participant.kda.kills} / {participant.kda.deaths} / {participant.kda.assists}</span>
                            <span>{calc_kda(participant.kda.kills, participant.kda.deaths, participant.kda.assists)} kda</span>
                        </div>

                        <!-- DAMAGE DEALT -->
                        <div class="flex flex-col items-center">
                            <span class="text-xs">{parse_k_num(participant.champ.damageDealt)}</span>
                            <div title="Damage dealt: {participant.champ.damageDealt}" class="ml-2 h-2 w-20 rounded bg-zinc-300 dark:bg-zinc-600">
                                <div class="h-2 rounded bg-red-400" style="width: {(participant.champ.damageDealt / MAX_DMG_DEALT) * 100}%" />
                            </div>
                        </div>

                        <!-- DAMAGE TAKEN -->
                        <div class="flex flex-col items-center">
                            <span class="text-xs">{parse_k_num(participant.champ.damageTaken)}</span>
                            <div title="Damage taken: {participant.champ.damageTaken}" class="ml-2 h-2 w-20 rounded bg-zinc-300 dark:bg-zinc-600">
                                <div class="h-2 rounded bg-blue-400" style="width: {(participant.champ.damageTaken / MAX_DMG_TAKEN) * 100}%" />
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
        {/if}
    </div>
</button>

<style>
    .transition {
        transition: all 0.3s ease-in-out;
    }
</style>
