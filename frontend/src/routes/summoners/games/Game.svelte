<!--
  @component
  ## Game component
  Display a game row
-->
<script lang="ts">
    import type { ParticipantDto } from '$lib/types/player/Game.dto'
    import { styles } from '$lib/config'
    import { RiotService } from '$lib/services/Riot.service'
    import SummonersGrid from './SummonersGrid.svelte'
    import type { GameDto } from '$lib/types'
    import { classNames } from '$lib/utils'

    export let game: GameDto
    export let participant: ParticipantDto

    let expanded = false

    const calc_kda = (kills: number, deaths: number, assists: number) => (deaths ? ((kills + assists) / deaths).toFixed(1) : kills + assists)

    function rowStyle(): string {
        if (game.gameDuration < 300) {
            return 'border-zinc-500 bg-zinc-500/10 dark:bg-zinc-500/10'
        }
        return participant.win ? 'border-green-500 bg-green-500/10 dark:bg-green-500/10' : 'border-red-500 bg-red-500/10 dark:bg-red-500/10'
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class={classNames(
        `${styles.shadow} ${styles.scale}`, // base styles
        `transition ${expanded ? 'h-96' : 'h-36'}`, //expandable
        'mx-4 my-2 grid cursor-pointer grid-cols-3 rounded-lg border-8 border-y-0 border-r-0', //adjustment
        rowStyle(), //row color
    )}
    on:click={() => (expanded = !expanded)}
>
    <div class="relative text-white">
        <div class="t-0 l-0 absolute h-full w-full bg-cover bg-top" style="background-image: url({RiotService.champSplash(participant.champ.championName)})" />
        <div class="t-0 l-0 absolute h-full w-full" style="background-image: linear-gradient(to top right, #000000bd , #ffffff00)" />
        <div class="absolute top-2 left-3">
            <img src={RiotService.teamPositionIcon(participant.teamPosition)} alt="champ" style="width: 42px; height: 42px;" />
        </div>
        <span class="absolute top-3 left-14 text-center text-xl">{participant.champ.champLevel}</span>
        <span class="absolute bottom-1 left-2">{game.gameMode}</span>
        <span class="absolute bottom-1 right-2">
            {(game.gameDuration / 60).toFixed(0)}:{(game.gameDuration % 60).toFixed(0).padStart(2, '0')}
        </span>
    </div>
    <div class="relative flex flex-col items-center text-center">
        <div class="absolute top-1 bottom-1 left-3">
            <div class="flex h-full flex-col justify-around">
                <img class="rounded" src={participant.spells[0]} alt="spell 2" style="width: 32px; height: 32px;" />
                <img class="rounded" src={participant.spells[1]} alt="spell 1" style="width: 32px; height: 32px;" />
                <img class="rounded" src={participant.ward} alt="guard" style="width: 32px; height: 32px;" />
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
    <div>
        <SummonersGrid {game} />
    </div>
</div>

<style>
    .transition {
        transition: all 0.3s ease-in-out;
    }
</style>
