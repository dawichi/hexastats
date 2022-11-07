<!--
  @component
  ## Game component
  Display a game row
-->
<script lang="ts">
    import type { GameDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { classNames } from '$lib/utils'
    import { RiotService } from '$lib/services/Riot.service'
    import SummonersGrid from './SummonersGrid.svelte'

    export let game: GameDto

    const gameMinutes = (game.gameDuration / 60).toFixed(0)
    const gameSeconds = game.gameDuration % 60
    const { teamPosition, win, items, champ, kda, spells } = game.participants[game.participantNumber]
    const { championName, champLevel } = champ
    const { kills, deaths, assists } = kda
    const calc_kda = deaths ? ((kills + assists) / deaths).toFixed(1) : kills + assists
</script>

<div
    class={classNames(
        `${styles.shadow} ${styles.background} ${styles.scale} ${win ? 'border-green-500' : 'border-red-500'}`,
        'cursor-pointer border-8 border-y-0 border-r-0 rounded-lg mx-4 my-2 grid grid-cols-3',
    )}
>
    <div class="relative text-white">
        <div class="t-0 l-0 absolute h-full w-full bg-cover bg-top" style={`background-image: url(${RiotService.champSplash(championName)})`} />
        <div class="t-0 l-0 absolute h-full w-full" style={`background-image: linear-gradient(to top right, #000000bd , #ffffff00)`} />
        <div class="absolute top-2 left-3">
            <img src={RiotService.teamPositionIcon(teamPosition)} alt="champ" style="width: 42px; height: 42px;" />
        </div>
        <span class="absolute top-3 left-14 text-center text-xl">{champLevel}</span>
        <span class="absolute bottom-1 left-2">{game.gameMode}</span>
        <span class="absolute bottom-1 right-2">
            {gameMinutes}:{gameSeconds}
        </span>
    </div>
    <div class="relative flex flex-col items-center text-center">
        <div class="absolute top-1 bottom-1 left-3">
            <div class="flex h-full flex-col justify-around">
                <img class="rounded" src={spells[1]} alt="spell 2" style="width: 42px; height: 42px;" />
                <img class="rounded" src={spells[0]} alt="spell 1" style="width: 42px; height: 42px;" />
                <img class="rounded" src={items[6]} alt="guard" style="width: 42px; height: 42px;" />
            </div>
        </div>
        <p>
            <span>{kills} / {deaths} / {assists}</span>
            <span class="ml-6 text-sm">{calc_kda} kda</span>
        </p>
        <div class="mt-4 ml-4">
            <div class="grid grid-cols-3 gap-2">
                {#each Object.keys(items) as itemId}
                    <span>
                        {#if items[itemId]}
                            <img class="rounded" src={items[itemId]} alt="item" style="width: 36px; height: 36px;" />
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
