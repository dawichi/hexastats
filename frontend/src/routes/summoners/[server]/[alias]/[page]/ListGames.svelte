<!--
  @component
  ## List Games component
  List all games from a player
-->
<script lang="ts">
    import type { GameDto, SummonerDto } from '$lib/types'
    import Game from './games/Game.svelte'
    import { styles } from '$lib/config'
    import { MockGame, Pagination } from '$lib/components'
    import { SummonerService } from '$lib/services/Summoner.service'
    import { filteredGamesContext, playerContext } from '$lib/context/players'

    export let player: SummonerDto

    // Context
    let _filteredGames: GameDto[] = []
    let _activeFilter = ''
    filteredGamesContext.subscribe(data => (_filteredGames = data.games))
    filteredGamesContext.subscribe(data => (_activeFilter = data.activeFilter))
    filteredGamesContext.set({
        activeFilter: '',
        games: player.games,
    })

    const getGameModes = (player: SummonerDto) => [...new Set(player.games.map(game => game.gameMode))]
    // const getChampsPlayed = (player: SummonerDto) => [...new Set(player.games.map(game => game.participants[game.participantNumber].champ.championName))]

    function getNumGamesByMode(gameMode: string, player: SummonerDto): number {
        const gameModeCounts: Record<string, number> = {}
        for (const gameMode of getGameModes(player)) {
            gameModeCounts[gameMode] = player.games.filter(game => game.gameMode === gameMode).length
        }
        return gameModeCounts[gameMode]
    }

    function filterBy(filter: string) {
        if (_activeFilter === filter) {
            return filteredGamesContext.update(data => ({
                activeFilter: '',
                games: player.games
            }))
        }

        filteredGamesContext.update(data => ({
            activeFilter: filter,
            games: getGameModes(player).includes(filter)
                ? player.games.filter(game => game.gameMode === filter)
                : player.games.filter(game => game.championName === filter),
        }))
    }
</script>

<div>
    <!-- {#each getGameModes(player) as gameMode}
        <button
            on:click={() => filterBy(gameMode)}
            class="{styles.card} {styles.scale} mx-4 my-2 cursor-pointer {_activeFilter === gameMode ? 'bg-indigo-900' : 'bg-indigo-600'} p-3 px-6 text-white"
            >{gameMode} ({getNumGamesByMode(gameMode, player)})</button
        >
    {/each} -->

    <div class="flex items-center justify-center gap-2 px-4">
        <hr class="w-full" />
        <span class="whitespace-nowrap">
            Games loaded: {player.games.length}
        </span>
        <hr class="w-full" />
    </div>

    <div class="grid gap-2">
        {#each _filteredGames as game}
            <Game {game} server={player.server} />
        {/each}
    </div>

    <Pagination />
</div>
