<script lang="ts">
    import type { RankDataDto, StatsDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { formatDate } from '$lib/utils'
    import { RiotService } from '$lib/services/Riot.service'
    import { modalGameContext } from '$lib/context/modalGame'
    import { backendUrl } from '$lib/services/Summoner.service'

    export let player: RankDataDto
    export let stats: StatsDto

    const riotService = RiotService.getInstance()

    // Prevent multiple modals
    let loading = false
    async function openModal(matchId: string) {
        if (loading) return
        loading = true
        const response = await fetch(`${backendUrl}summoners/${player.server}/${player.alias}/games/${matchId}`)
        const game = await response.json()

        modalGameContext.set({
            isModalOpen: true,
            game,
        })
        loading = false
    }
</script>

<div class="grid grid-cols-2 gap-4 p-2 sm:grid-cols-3 lg:grid-cols-4">
    {#each Object.entries(stats.records).filter(entry => entry[1].value !== 0) as [key, record]}
        <button on:click={() => openModal(record.matchId)} class="{styles.card} text-left cursor-pointer transition hover:scale-105">
            <div class="relative h-48 w-full rounded-t bg-cover bg-center" style="background-image: url({riotService.champSplash(record.championName)})">
                <span class="absolute top-0 right-1 text-xs">{record.matchId}</span>
            </div>

            <div class="p-4 {styles.foreground} relative rounded-b">
                <h4 class="mb-4 text-xl">{key}</h4>
                <h5 class="text-xl font-bold">{record.value}</h5>

                <div class="absolute bottom-2 right-2 text-center text-sm">
                    {#if record.gameMode}
                        <p>{formatDate(record.gameCreation, record.gameDuration)}</p>
                        <p>{record.gameMode}</p>
                    {:else}
                        <p><i class="bi bi-emoji-frown" /> No data found</p>
                    {/if}
                </div>
            </div>
        </button>
    {/each}
</div>
