<script lang="ts">
    import type { RecordValueDto } from "$lib/types"
    import { styles } from "$lib/config"
    import { onMount } from "svelte"
    import { SummonerService } from "$lib/services/Summoner.service"

    export let data: RecordValueDto
    export let title: string

    const summonerService = SummonerService.getInstance()
</script>

<div class="{styles.foreground} {styles.card} p-4">
    <h4>{title}</h4>
    {data.value}
</div>
