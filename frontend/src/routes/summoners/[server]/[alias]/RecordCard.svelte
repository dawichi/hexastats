<script lang="ts">
    import type { RecordValueDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { formatDate } from '$lib/utils'
    import { RiotService } from '$lib/services/Riot.service'

    export let data: RecordValueDto
    export let title: string

    const riotService = RiotService.getInstance()
</script>

<!-- This IF avoids to display the card if mocked data arrives (gameMode = '') -->
<div class="{styles.card} cursor-pointer transition hover:scale-105">
    <div class="relative h-48 w-full rounded-t bg-cover bg-center" style="background-image: url({riotService.champSplash(data.championName)})">
        <span class="absolute top-0 right-1 text-xs">{data.matchId}</span>
    </div>

    <div class="p-4 {styles.foreground} relative rounded-b">
        <h4 class="mb-4 text-xl">{title}</h4>
        <h5 class="text-xl font-bold">{data.value}</h5>

        <div class="absolute bottom-2 right-2 text-center text-sm">
            {#if data.gameMode}
                <p>{formatDate(data.gameCreation, data.gameDuration)}</p>
                <p>{data.gameMode}</p>
            {:else}
                <p><i class="bi bi-emoji-frown" /> No data found</p>
            {/if}
        </div>
    </div>
</div>
