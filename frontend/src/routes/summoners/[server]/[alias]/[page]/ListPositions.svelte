<!--
  @component
  ## List Positions component
  List positions played by the player
-->
<script lang="ts">
    import { RiotService } from '$lib/services/Riot.service'
    import type { PositionStatsDto } from '$lib/types'
    import { winrate } from '$lib/utils'

    export let positions: Array<PositionStatsDto>

    const riotService = RiotService.getInstance()

    function styleWinrate(winrate: number): string {
        if (winrate < 45) return 'text-red-500'
        if (winrate > 55) return 'text-green-500'
        return ''
    }

    const maxGames = () => Math.max(...positions.map(position => position.games))
</script>

<div class="grid grid-rows-5 p-4 gap-x-2">
    <section class="mb-4 grid grid-cols-6 gap-2">
        <h4>Role</h4>
        <h4>Record</h4>
        <h4>Winrate</h4>
        <h4 class="col-span-3">Wins / Losses</h4>
    </section>
    {#each positions as position}
        <section class="grid grid-cols-6 items-center gap-2 text-sm md:text-base">
            <img src={riotService.teamPositionIcon(position.position)} width={35} height={35} alt="position" />
            <span>{position.wins} / {position.games}</span>
            <span class="{position.games ? '' : 'invisible'} {styleWinrate(winrate(position.wins, position.games - position.wins))}">{winrate(position.wins, position.games - position.wins)} %</span>
            <div class="col-span-3 h-2 rounded overflow-hidden bg-zinc-600">
                <div class="flex" style="width: {(position.games / maxGames()) * 100}%">
                    <!-- GREEN BAR: represents number of wins -->
                    <div class="h-2 bg-green-400" style="width: {(position.wins / position.games) * 100}%" />
                    <!-- RED BAR: represents number of defeats -->
                    <div class="h-2 rounded-r bg-red-400" style="width: {((position.games - position.wins) / position.games) * 100}%" />
                </div>
            </div>
        </section>
    {/each}
</div>
