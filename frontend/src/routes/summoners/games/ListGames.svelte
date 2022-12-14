<!--
  @component
  ## List Games component
  List all games from a player
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { SummonerService } from '$lib/services/Summoner.service'
    import { playersContext } from '$lib/context/players'
    import Game from './Game.svelte'
    import { MockImage } from '$lib/components'

    export let player: SummonerDto

    // Context
    let _players: SummonerDto[] = []
    playersContext.subscribe(players => (_players = players))

    // Load games logic
    let loadingGames: boolean = false

    async function loadMoreGames(): Promise<void> {
        loadingGames = true
        try {
            const playerData = await SummonerService.addGames(player.server, player.alias, player.games.length)
            playersContext.update(players => players.map(p => (p.alias === player.alias ? playerData : p)))
        } catch (error) {
            console.error(error)
        }
        loadingGames = false
    }

    // Utils
    const mockUpStyle = 'rounded-full bg-zinc-400 dark:bg-zinc-800'
</script>

<div>
    {#each player.games as game}
        <Game {game} participant={game.participants[game.participantNumber]} />
    {/each}

    {#if player.games.length < 51}
        <div class="flex justify-center">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            {#if !loadingGames}
                <button on:click={loadMoreGames} class="{styles.card} {styles.scale} mx-4 my-2 cursor-pointer bg-indigo-600 p-3 px-6 text-white">
                    <i class="bi bi-cloud-download mr-2" /> Load 10 more games
                </button>
            {:else}
                <div class="{styles.background} {styles.card} mx-4 my-2 grid h-36 w-full animate-pulse grid-cols-3">
                    <!-- Champ Image -->
                    <div class="relative h-full">
                        <MockImage height="h-full" width="w-full" />
                        <div class="absolute top-2 left-2">
                            <div class="my-1 h-2.5 w-20 {mockUpStyle}" />
                            <div class="my-1 h-2.5 w-24 {mockUpStyle}" />
                        </div>
                        <div class="absolute bottom-2 left-2">
                            <div class="my-1 h-2.5 w-20 {mockUpStyle}" />
                        </div>
                        <div class="absolute bottom-2 right-2">
                            <div class="my-1 h-2.5 w-20 {mockUpStyle}" />
                        </div>
                    </div>

                    <!-- Items -->
                    <div class="relative flex flex-col items-center text-center">
                        <div class="absolute top-1 bottom-1 left-3">
                            <div class="flex h-full flex-col justify-around">
                                <MockImage height="h-10" width="w-10" />
                                <MockImage height="h-10" width="w-10" />
                                <MockImage height="h-10" width="w-10" />
                            </div>
                        </div>
                        <div class="mt-2 flex gap-4">
                            <div class="my-1 h-2.5 w-16 {mockUpStyle}" />
                            <div class="my-1 h-2.5 w-12 {mockUpStyle}" />
                        </div>
                        <div class="mt-4 ml-4">
                            <div class="grid grid-cols-3 gap-2">
                                {#each [0, 1, 2, 3, 4, 5] as _}
                                    <MockImage height="h-10" width="w-10" />
                                {/each}
                            </div>
                        </div>
                    </div>

                    <!-- Items -->
                    <div class="grid grid-cols-2 p-1">
                        {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as _}
                            <div class="flex items-center pl-2">
                                <MockImage height="h-6" width="w-6" />
                                <div class="ml-1 h-2.5 w-12 {mockUpStyle}" />
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>
