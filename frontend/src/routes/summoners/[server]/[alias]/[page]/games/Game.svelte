<!--
  @component
  ## Game component
  Display a game row
-->
<script lang="ts">
    import type { GameDto } from '$lib/types'

    import { styles } from '$lib/config'
    import { RiotService } from '$lib/services/Riot.service'
    import { classNames } from '$lib/utils'
    import { formatDate } from '$lib/utils/formatDate'
    import GameCollapsed from './GameCollapsed.svelte'
    import { modalGameContext } from '$lib/context/general'
    import { backendUrl } from '$lib/services/Summoner.service'

    export let game: GameDto
    export let server: string

    const riotService = RiotService.getInstance()

    let expanded = false

    function rowStyle(game: GameDto): { row: string; btn: string } {
        if (game.isEarlySurrender) {
            return {
                row: 'border-zinc-500 bg-zinc-500/20',
                btn: 'bg-zinc-500',
            }
        }
        return game.win ? { row: 'border-green-500 bg-green-500/20', btn: 'bg-green-500' } : { row: 'border-red-500 bg-red-500/20', btn: 'bg-red-500' }
    }

    function cardShadow(game: GameDto): string {
        if (game.isEarlySurrender) {
            return `${styles.game.shadowDraw}`
        }
        return game.win ? `${styles.game.shadowWin}` : `${styles.game.shadowLose}`
    }
    
    // Prevent multiple modals
    let loading = false
    async function openModal(matchId: string) {
        if (loading) return
        loading = true
        const response = await fetch(`${backendUrl}summoners/${server}/${game.participants[game.participantNumber].summonerName}/games/${matchId}`)
        const data = await response.json()

        modalGameContext.set({
            isModalOpen: true,
            game: data,
        })
        loading = false
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="{styles.background} transition {expanded ? 'h-96' : 'h-32'} mx-2 rounded-lg {cardShadow(game)}">
    <div
        class={classNames(
            `transition ${expanded ? 'h-96' : 'h-32'}`, //expandable
            'relative grid grid-cols-3 rounded-lg border-8 border-y-0 border-r-0 pr-6', //adjustment
            rowStyle(game).row, //row color
        )}
    >
        <!-- Left part, heaf of the row, containing the champ image and some data -->
        <div>
            <div class="relative text-xs text-white sm:text-base transition {expanded ? 'h-80' : 'h-32'}">
                <div
                    class="t-0 l-0 absolute h-full w-full bg-cover bg-top"
                    style="background-image: url({riotService.champSplash(game.championName)})"
                />
                <div class="t-0 l-0 absolute h-full w-full" style="background-image: linear-gradient(to top right, #000000bd , #ffffff00)" />
                <div class="absolute top-2 left-3">
                    <img src={riotService.teamPositionIcon(game.teamPosition)} alt="champ" style="width: 42px; height: 42px;" />
                </div>
                <span class="absolute top-3 left-14 text-center text-xl">{game.champLevel}</span>
                <span class="absolute bottom-4 left-2 sm:text-sm">{formatDate(game.gameCreation, game.gameDuration)}</span>
                <span class="absolute bottom-8 left-2">{game.gameMode}</span>
                <span class="absolute bottom-0 left-2 text-xs">{game.matchId}</span>
                <span class="absolute bottom-1 right-2">
                    {(game.gameDuration / 60).toFixed(0)}:{(game.gameDuration % 60).toFixed(0).padStart(2, '0')}
                </span>
            </div>

            <!-- When expanded it shows extra data -->
            <!-- <div class="transition {expanded ? 'h-16' : 'h-0 invisible'} grid grid-rows-2 text-white">
                {#each game.teams as team, idx}
                    <div class="grid grid-cols-4 {idx ? 'bg-red-400/80' : 'bg-blue-400/80'}">
                        <div class="flex items-center justify-center gap-2">
                            <img class="w-6" src="/icons/baron.svg" alt="baron icon" title="Barons" />
                            <span class="w-6">{team.objectives?.baron?.kills}</span>
                        </div>
                        <div class="flex items-center justify-center gap-2">
                            <img class="w-6" src="/icons/champion.svg" alt="champion icon" title="Barons" />
                            <span class="w-6">{team.objectives?.champion?.kills}</span>
                        </div>
                        <div class="flex items-center justify-center gap-2">
                            <img class="w-6" src="/icons/dragon.svg" alt="dragon icon" title="Barons" />
                            <span class="w-6">{team.objectives?.dragon?.kills}</span>
                        </div>
                    </div>
                {/each}
            </div> -->
        </div>



        <GameCollapsed {game} {server} />

        <!-- Right button, which modifies the expanded property onclick -->
        <button
            on:click={() => openModal(game.matchId)}
            class="absolute right-0 top-0 bottom-0 w-4 cursor-pointer rounded-tr-lg rounded-br-lg {rowStyle(game).btn}"
        >
            <i class="bi text-white {expanded ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}" />
        </button>
    </div>
</div>

<style>
    .transition {
        transition: all 0.3s ease-in-out;
    }
</style>
