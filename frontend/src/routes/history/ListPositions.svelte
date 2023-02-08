<!--
  @component
  ## List Positions component
  List positions played by the player
-->
<script lang="ts">
    import { RiotService } from '$lib/services/Riot.service'
    import type { SummonerDto } from '$lib/types'

    export let player: SummonerDto

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
            const position = game.participants[game.participantNumber].teamPosition || 'MIDDLE'
            positions[position].games++
            positions[position].wins += game.participants[game.participantNumber].win ? 1 : 0
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

<div class="grid grid-cols-5 pb-4">
    {#each buildPosition(player).positions as position}
        <div class="flex flex-col items-center gap-2 text-center">
            <span>{position.wins} / {position.games}</span>

            <img src={RiotService.teamPositionIcon(position.key)} width={35} height={35} alt="position" />

            {#if position.games}
            <span class="{styleWinrate(winrate(position.wins, position.games - position.wins))}">{winrate(position.wins, position.games - position.wins)} %</span>
            {/if}
        </div>
    {/each}
</div>
