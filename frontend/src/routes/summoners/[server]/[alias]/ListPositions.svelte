<!--
  @component
  ## List Positions component
  List positions played by the player
-->
<script lang="ts">
    import { RiotService } from '$lib/services/Riot.service'
    import type { SummonerDto } from '$lib/types'

    export let player: SummonerDto

    const riotService = RiotService.getInstance()

    type Position = {
        key: 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY'
        games: number
        wins: number
    }

    type PositionValue = {
        games: number
        wins: number
    }

    function buildPosition(player: SummonerDto): {
        positions: Position[]
        maxGames: number
    } {
        const positions: Record<string, PositionValue> = {
            TOP: { games: 0, wins: 0 },
            JUNGLE: { games: 0, wins: 0 },
            MIDDLE: { games: 0, wins: 0 },
            BOTTOM: { games: 0, wins: 0 },
            UTILITY: { games: 0, wins: 0 },
        }

        // Fill the positions
        player.games.map(game => {
            // Don't use ?? as it comes as '' instead of null or undefined
            const position = game.teamPosition || 'MIDDLE'
            positions[position].games++
            positions[position].wins += game.win ? 1 : 0
        })

        // Check the maximum number of games
        let maxGames = 0
        for (const position in positions) {
            if (positions[position].games > maxGames) {
                maxGames = positions[position].games
            }
        }

        const positionsArray: Position[] = Object.keys(positions).map(key => ({
            key: key as 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY',
            games: positions[key].games,
            wins: positions[key].wins,
        }))

        return {
            positions: positionsArray,
            maxGames,
        }
    }

    function winrate(wins: number, losses: number): number {
        if (!(wins + losses)) return 0
        return Math.round((wins / (wins + losses)) * 100)
    }

    function styleWinrate(winrate: number): string {
        if (winrate < 45) return 'text-red-500'
        if (winrate > 55) return 'text-green-500'
        return ''
    }
</script>

<div class="grid grid-rows-5 p-4 gap-x-2">
    <section class="mb-4 grid grid-cols-6 gap-2">
        <h4>Role</h4>
        <h4>Record</h4>
        <h4>Winrate</h4>
        <h4 class="col-span-3">Wins / Losses</h4>
    </section>
    {#each buildPosition(player).positions as position}
        <section class="grid grid-cols-6 items-center gap-2 text-sm md:text-base">
            <img src={riotService.teamPositionIcon(position.key)} width={35} height={35} alt="position" />
            <span>{position.wins} / {position.games}</span>
            <span class="{position.games ? '' : 'invisible'} {styleWinrate(winrate(position.wins, position.games - position.wins))}">{winrate(position.wins, position.games - position.wins)} %</span>
            <div class="col-span-3 h-2 rounded overflow-hidden bg-zinc-600">
                <div class="flex" style="width: {(position.games / buildPosition(player).maxGames) * 100}%">
                    <!-- GREEN BAR: represents number of wins -->
                    <div class="h-2 bg-green-400" style="width: {(position.wins / position.games) * 100}%" />
                    <!-- RED BAR: represents number of defeats -->
                    <div class="h-2 rounded-r bg-red-400" style="width: {((position.games - position.wins) / position.games) * 100}%" />
                </div>
            </div>
        </section>
    {/each}
</div>
