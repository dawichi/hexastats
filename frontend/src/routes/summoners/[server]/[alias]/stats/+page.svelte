<script lang="ts">
    import { page } from "$app/stores"
    import { Container } from "$lib/components"
    import { styles } from "$lib/config"
    import { RiotService } from "$lib/services/Riot.service"
    import type { StatsDto } from "$lib/types"
    import { winrate } from "$lib/utils"

    /** @type {import('./$types').PageData} */
    export let data: {
        stats: StatsDto
    }
    
    const [x, y, server, alias, page_num] = $page.url.pathname.split('/')
    
    const riotService = RiotService.getInstance()

    const maxGames = () => Math.max(...data.stats.statsByChamp.map(champ => champ.games))
    const maxKDA = () => Math.max(...data.stats.statsByChamp.sort((a, b) => b.games - a.games).map(champ => champ.kda).slice(0, 7))
</script>

<Container title="" description="" disableHeader>
    <a href="/summoners/{server}/{alias}/1" class="rounded bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600">
        <i class="bi bi-arrow-90deg-left pr-2"></i> BACK
    </a>
    <div class="{styles.foreground} {styles.card} p-4">
        <h2 class="pt-3 text-center text-2xl">Champions</h2>
        <hr class="m-2" />
        <div class="grid grid-cols-4 p-2 text-center">
            <span>Champ</span>
            <span>Games</span>
            <span>Winrate</span>
            <span>KDA</span>
        </div>

        {#each data.stats.statsByChamp.sort((a, b) => b.games - a.games).slice(0, 7) as champ}
            <div class="grid grid-cols-4 px-4">
                <div class="flex justify-center">
                    <button class="p-1 transition-transform hover:scale-125">
                        <img class="w-12 rounded" src={riotService.champImage(champ.championName)} alt="champion" />
                    </button>
                </div>
    
                <div class="w-full px-2">
                    <span class="flex justify-center">{champ.games}</span>
                    <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                        <div class="h-2 rounded bg-blue-400" style="width: {(champ.games / maxGames()) * 100}%" />
                    </div>
                </div>
    
                <div class="w-full px-2">
                    <span class="flex justify-center">{winrate(champ.wins, champ.games - champ.wins)}%</span>
                    <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                        <div class="h-2 rounded bg-red-400" style="width: {winrate(champ.wins, champ.games - champ.wins)}%" />
                    </div>
                </div>
    
                <div class="w-full px-2">
                    <span class="flex justify-center">{champ.kda}</span>
                    <div class="h-2 rounded bg-zinc-300 dark:bg-zinc-600">
                        <div class="h-2 rounded bg-green-400" style="width: {(champ.kda / maxKDA()) * 100}%" />
                    </div>
                </div>
            </div>
        {/each}
    </div>
</Container>