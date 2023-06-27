<!-- Visualize the player details -->
<script lang="ts">
    import type { MasteryDto, RankDataDto } from '$lib/types'
    import { Container, MasteryRow, RankStructure } from '$lib/components'
    import { RiotService } from '$lib/services/Riot.service'

    /** @type {import('./$types').LayoutData} */
    export let data: {
        player: RankDataDto;
        masteries: MasteryDto[];
    }

    const riotService = RiotService.getInstance()
</script>

<Container title="" description="" disableHeader>
    <div class="relative rounded-lg bg-contain shadow" style="background-image: url({riotService.champSplash(data.masteries[0].name)})">
        <section class="bg-orange-50/80 dark:bg-zinc-900/80 md:px-4">
            <header class="flex flex-col items-center justify-around py-5 lg:flex-row">
                <RankStructure player={data.player} />
                <MasteryRow masteries={data.masteries} />
            </header>

        </section>
    </div>
</Container>

<slot />
