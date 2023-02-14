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

    function rowStyle(): string {
        if (game.gameDuration < 300) {
            return 'border-zinc-500 bg-zinc-500/20 dark:bg-zinc-500/20'
        }
        return participant.win ? 'border-green-500 bg-green-500/20 dark:bg-green-500/20' : 'border-red-500 bg-red-500/20 dark:bg-red-500/20'
    }

    function cardShadow(): string {
        if (game.gameDuration < 300) {
            return `${styles.shadow}`
        }
        return participant.win ? `${styles.shadowwin}` : `${styles.shadowlose}`
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class={classNames(
        `${styles.background} ${styles.shadow},`, // base style
        `transition ${expanded ? 'h-96' : 'h-32'}`, //expandable
        'mx-4 my-2 cursor-pointer rounded-lg', //adjustment
        cardShadow(), //card shadow color styles
    )}
    on:click={() => (expanded = !expanded)}
>
    <div
        class={classNames(
            `transition ${expanded ? 'h-96' : 'h-32'}`, //expandable
            'grid grid-cols-3 rounded-lg border-8 border-y-0 border-r-0', //adjustment
            rowStyle(), //row color
        )}
    >
        <!-- [Left,_,_] block -->
        <div class="relative text-white">
            <div
                class="t-0 l-0 absolute h-full w-full bg-cover bg-top"
                style="background-image: url({RiotService.champSplash(participant.champ.championName)})"
            />
            <div class="t-0 l-0 absolute h-full w-full" style="background-image: linear-gradient(to top right, #000000bd , #ffffff00)" />
            <div class="absolute top-2 left-3">
                <img src={RiotService.teamPositionIcon(participant.teamPosition)} alt="champ" style="width: 42px; height: 42px;" />
            </div>
            <span class="absolute top-3 left-14 text-center text-xl">{participant.champ.champLevel}</span>
            <span class="absolute bottom-1 left-2 text-sm">{formatDate(game.gameCreation, game.gameDuration)}</span>
            <span class="absolute bottom-5 left-2">{game.gameMode}</span>
            <span class="absolute bottom-1 right-2">
                {(game.gameDuration / 60).toFixed(0)}:{(game.gameDuration % 60).toFixed(0).padStart(2, '0')}
            </span>
        </div>

        <!-- [_,Center,Right] block -->
        {#if !expanded}
            <div class="animate__animated animate__fadeIn relative flex flex-col items-center text-center">
                <div class="absolute top-1 bottom-1 left-3 grid grid-cols-2 px-0.5">
                    <div class="flex h-full flex-col justify-around">
                        <img class="rounded" src={participant.spells[0]} alt="spell 2" style="width: 32px; height: 32px;" />
                        <img class="rounded" src={participant.spells[1]} alt="spell 1" style="width: 32px; height: 32px;" />
                        <img class="rounded" src={participant.ward} alt="guard" style="width: 32px; height: 32px;" />
                    </div>
                    <div class="absolute bottom-1 right-0">
                        <img class="rounded" src={participant.perks[1]} alt="main runes" style="width: 32px; height: 32px;" />
                        <img class="rounded" src={participant.perks[0]} alt="secondary runes" style="width: 32px; height: 32px;" />
                    </div>

                </div>

                <p>
                    <span>{participant.kda.kills}</span> /
                    <span>{participant.kda.deaths}</span> /
                    <span>{participant.kda.assists}</span>
                    <span class="ml-6 text-sm">{calc_kda(participant.kda.kills, participant.kda.deaths, participant.kda.assists)} kda</span>
                </p>

                <div class="mt-4 ml-4">
                    <div class="grid grid-cols-3 gap-2">
                        {#each [0, 1, 2, 3, 4, 5] as itemId}
                            <span>
                                {#if participant.items[itemId]}
                                    <img class="rounded" src={participant.items[itemId]} alt="item" style="width: 36px; height: 36px;" />
                                {:else}
                                    <div class="rounded bg-gradient-to-br from-zinc-500 to-zinc-800" style="width: 36px; height: 36px;" />
                                {/if}
                            </span>
                        {/each}
                    </div>
                </div>
            </div>

            <SummonersGrid {game} />
        {:else}
            <div class="animate__animated animate__fadeIn col-span-2 flex flex-col justify-around overflow-hidden rounded-lg bg-white dark:bg-zinc-900">
                {#each game.participants as participant, idx}
                    <div class="flex h-full items-center border-y border-t-0 border-zinc-700 {idx < 5 ? 'bg-blue-400/30' : 'bg-red-400/30'}">
                        <div class="relative">
                            <img
                            class="mx-1 rounded"
                            src={RiotService.champImage(participant.champ.championName)}
                            alt="champion"
                            style="width: 32px; height: 32px;"
                            />
                            <span class="absolute top-0 bg-zinc-700 text-xs rounded-lg">{participant.champ.champLevel}</span>
                        </div>
                        <div class= "grid grid-cols-2">
                            <div class="flex flex-col">
                                <img class="rounded" src={participant.spells[0]} alt="spell 2" style="width: 16px; height: 16px;" />
                                <img class="rounded" src={participant.spells[1]} alt="spell 1" style="width: 16px; height: 16px;" />
                            </div>
                            <div class="flex flex-col">
                                <img class="rounded" src={participant.perks[1]} alt="main runes" style="width: 16px; height: 16px;" />
                                <img class="rounded" src={participant.perks[0]} alt="secondary runes" style="width: 16px; height: 16px;" />
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
                                        <img class="ml-1 rounded" src={participant.items[itemId]} alt="item" style="width: 28px; height: 28px;" />
                                    {:else}
                                        <div class="ml-1 rounded bg-gradient-to-br from-zinc-500 to-zinc-800" style="width: 28px; height: 28px;" />
                                    {/if}
                                </span>
                            {/each}
                            <img class="ml-1 rounded" src={participant.ward} alt="guard" style="width: 28px; height: 28px;" />
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .transition {
        transition: all 0.3s ease-in-out;
    }
</style>
