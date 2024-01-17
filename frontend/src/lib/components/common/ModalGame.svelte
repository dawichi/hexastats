<!--
  @component
  ## ModalGame
  used to display a game inside a modal
-->
<script lang="ts">
    import { rawServer, styles } from '$lib/config'
    import { modalGameContext } from '$lib/context/general'
    import { RiotService } from '$lib/services/Riot.service'
    import type { GameArenaDto, GameDetailDto, GameNormalDto } from '$lib/types'
    import { formatDate, kda, parse_k_num, secondsToMin, tooltip } from '$lib/utils'

    const riotService = RiotService.getInstance()

    const modal = {
        // Element.showModal() is still not noted in TS lib definitions
        open: () => {
            if (!document?.querySelector('[data-modal-game]')) return
            ;(document?.querySelector('[data-modal-game]') as any).showModal()
        },
        close: () => {
            if (!document?.querySelector('[data-modal-game]')) return
            ;(document?.querySelector('[data-modal-game]') as any).close()
        },
    }
    export let server: string
    // This memo the state to prevent multiple calls
    let isModalOpen = false
    let game: GameDetailDto
    $: modalGameContext.subscribe(val => {
        game = val.game

        // Skip re-render if the value is the same
        if (val.isModalOpen === isModalOpen) return

        // Update the memo and run the logic
        isModalOpen = val.isModalOpen
        val.isModalOpen ? modal.open() : modal.close()
    })

    // const isGameNormal = (data: GameNormalDto | GameArenaDto): data is GameNormalDto => 'perks' in data

    //const bgColor = (idx: number): string => game.teams[idx < 5 ? 0 : 1].win ? 'bg-green-500/20' : 'bg-red-500/20'

    // const MAX_DMG_DEALT = Math.max(...game.participants.map(participant => participant.champ.damageDealt))
    // const MAX_DMG_TAKEN = Math.max(...game.participants.map(participant => participant.champ.damageTaken))
</script>

<dialog data-modal-game class="relative rounded bg-zinc-900 p-2 text-white shadow-lg shadow-zinc-700">
    <div class="relative flex justify-between bg-zinc-900 p-1">
        <div>
            {#if game.matchId}
                <h2 class="text-lg font-bold">{game.participants[game.participantNumber].riotIdGameName}</h2>
                <span>{game.gameMode} | </span>
                <span>{formatDate(game.gameCreation, game.gameDuration)} | </span>
                <span>
                    {secondsToMin(game.gameDuration)}
                </span>
                <h3>{game.matchId}</h3>
            {/if}
        </div>
        <button
            class="h-6 w-6 border border-zinc-500 bg-zinc-700 text-white hover:border-red-500 hover:bg-red-500"
            on:click={() =>
                modalGameContext.update(val => ({
                    ...val,
                    isModalOpen: false,
                }))}
        >
            <i class="bi bi-x-lg" />
        </button>
    </div>

    {#if game.matchId}
        <div class="flex items-center justify-center gap-8">
            <!-- LEFT COL - SPLASHART -->
            <div class="hidden lg:block relative h-64 w-96 text-xs sm:text-base">
                <div />
                <div
                    class="t-0 l-0 absolute h-full w-full bg-cover bg-top"
                    style="background-image: url({riotService.champSplash(game.participants[game.participantNumber].champ.championName)})"
                />
                <div class="t-0 l-0 absolute h-full w-full" style="background-image: linear-gradient(to top right, #000000bd , #ffffff00)" />
                <div class="absolute top-2 left-3">
                    <img
                        src={riotService.teamPositionIcon(game.participants[game.participantNumber].teamPosition)}
                        alt="champ"
                        style="width: 42px; height: 42px;"
                    />
                </div>
                <span class="absolute top-3 left-14 text-center text-xl">{game.participants[game.participantNumber].champ.champLevel}</span>
                <span class="absolute bottom-1 left-2 sm:text-sm">{formatDate(game.gameCreation, game.gameDuration)}</span>
                <span class="absolute bottom-5 left-2 text-lg">{game.gameMode}</span>
                <span class="absolute bottom-1 right-2">
                    {secondsToMin(game.gameDuration)}
                </span>
            </div>
            <!-- RIGHT COL - LIST PARTICIPANTS -->
            {#if game.gameMode === 'CHERRY'}
                <div class="animate__animated animate__fadeIn relative col-span-2 xl:grid grid-cols-2 px-2 text-center">
                    {#each [0, 2, 4, 6] as teamIndex}
                        <section class="grid md:grid-cols-2">
                            {#each game.participants.slice(teamIndex, teamIndex + 2) as participant}
                                <div
                                    class="m-2 grid grid-cols-3 gap-3 {participant.isEarlySurrender
                                        ? participant.win
                                            ? 'bg-zinc-500/40'
                                            : 'bg-zinc-500/20'
                                        : participant.win
                                        ? 'bg-green-500/20'
                                        : 'bg-red-500/20'}"
                                >
                                    <div class="relative grid grid-cols-2">
                                        <img class="m-1 h-12 w-12" src={riotService.champImage(participant.champ.championName)} alt="champ" />
                                        <span class="absolute -bottom-1 -left-1 m-1 rounded-tr bg-zinc-800 px-[2px] text-sm"
                                            >{participant.champ.champLevel}</span
                                        >
                                        <!-- AUGMENTS -->
                                        <div class="mt-1 grid grid-cols-2 items-center">
                                            {#each participant.augments as augment}
                                                <img
                                                    title={augment.description}
                                                    class="rounded-full bg-black {styles.iconSize.medium} rounded"
                                                    src={riotService.augmentURL(augment.iconLarge)}
                                                    alt="item"
                                                    use:tooltip
                                                />
                                            {/each}
                                        </div>
                                    </div>

                                    <!-- <p class="relative col-span-2 flex items-center justify-center">{participant.summonerName}</p> -->
                                    <a
                                        href={`/summoners/${rawServer(server)}/${participant.riotIdGameName}-${participant.riotIdTagLine}/1`}
                                        class="relative col-span-2 flex items-center justify-center hover:underline {participant.riotIdGameName ===
                                        game.participants[game.participantNumber].riotIdGameName
                                            ? 'font-bold'
                                            : ''}"
                                        on:click={() =>
                                            modalGameContext.update(val => ({
                                                ...val,
                                                isModalOpen: false,
                                            }))}
                                    >
                                        {participant.riotIdGameName}
                                    </a>

                                    <!-- KDA -->
                                    <div class="xl:w-28 text-center">
                                        <p>{participant.kills} / {participant.deaths} / {participant.assists}</p>
                                        <p><strong>{kda(participant.kills, participant.deaths, participant.assists)}</strong> KDA</p>
                                    </div>

                                    <!-- PLACEMENT -->
                                    <div class="align-center grid text-4xl">
                                        <p><strong>{participant.placement}º</strong></p>
                                    </div>

                                    <!-- DAMAGES -->
                                    <div class="grid grid-rows-2 gap-1">
                                        <!-- DAMAGE DEALT -->
                                        <div class="flex flex-col items-center">
                                            <span class="text-xs">{parse_k_num(participant.champ.damageDealt)}</span>
                                            <div class="h-2 w-20 xl:w-14 2xl:w-20 rounded-sm bg-zinc-300 dark:bg-zinc-600">
                                                <div
                                                    title="Damage dealt: {participant.champ.damageDealt}"
                                                    class="h-2 rounded-sm bg-red-400"
                                                    style="width: {(participant.champ.damageDealt /
                                                        Math.max(...game.participants.map(participant => participant.champ.damageDealt))) *
                                                        100}%"
                                                />
                                            </div>
                                        </div>

                                        <!-- DAMAGE TAKEN -->
                                        <div class="flex flex-col items-center">
                                            <div class="h-2 w-20 xl:w-14 2xl:w-20 rounded-sm bg-zinc-300 dark:bg-zinc-600">
                                                <div
                                                    title="Damage taken: {participant.champ.damageTaken}"
                                                    class="h-2 rounded-sm bg-blue-400"
                                                    style="width: {(participant.champ.damageTaken /
                                                        Math.max(...game.participants.map(participant => participant.champ.damageTaken))) *
                                                        100}%"
                                                />
                                            </div>
                                            <span class="text-xs">{parse_k_num(participant.champ.damageTaken)}</span>
                                        </div>
                                    </div>

                                    <!-- ITEMS -->
                                    <div class="col-span-3 m-2 flex items-center">
                                        <div class="mx-auto grid grid-cols-7">
                                            {#each [0, 1, 2, 3, 4, 5] as itemId}
                                                <span class="m-0.5">
                                                    {#if participant.items[itemId]}
                                                        <img
                                                            class="{styles.iconSize.large} rounded"
                                                            src={riotService.itemURL(participant.items[itemId])}
                                                            alt="item"
                                                        />
                                                    {:else}
                                                        <div class="{styles.iconSize.large} rounded bg-gradient-to-br from-zinc-500 to-zinc-800" />
                                                    {/if}
                                                </span>
                                            {/each}
                                            <img class="{styles.iconSize.large} rounded" src={riotService.itemURL(participant.ward)} alt="ward" />
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </section>
                    {/each}
                </div>
            {:else}
                <div class="animate__animated animate__fadeIn relative col-span-2 flex items-center justify-between px-2 text-center">
                    <!-- RIGHT COL - LIST PARTICIPANTS -->
                    <section class="flex flex-col gap-2">
                        {#each game.participants as participant, idx}
                            <div
                                class="grid grid-cols-3 md:flex flex-row items-center gap-x-1 p-1 {participant.isEarlySurrender
                                    ? participant.win
                                        ? 'bg-zinc-500/40'
                                        : 'bg-zinc-500/20'
                                    : participant.win
                                    ? 'bg-green-500/20'
                                    : 'bg-red-500/20'}"
                            >
                                <!-- IMAGE and Level -->
                                <div class="relative grid grid-cols-2">
                                    <div class="relative">
                                        <img class="h-12 w-12" src={riotService.champImage(participant.champ.championName)} alt="champ" />
                                        <span class="absolute -bottom-1 -left-1 rounded-tr bg-zinc-800 px-[2px] text-sm">{participant.champ.champLevel}</span>
                                    </div>

                                    <!-- SPELLS, RUNES -->
                                    <div class="grid w-12 grid-cols-2">
                                        {#each [riotService.spellUrl(participant.spells[0]), participant.perks.primary, riotService.spellUrl(participant.spells[1]), participant.perks.secondary] as src}
                                            <img class="{styles.iconSize.medium} rounded" {src} alt="spell 2" />
                                        {/each}
                                    </div>
                                </div>

                                <a
                                    href={`/summoners/${rawServer(server)}/${participant.riotIdGameName}-${participant.riotIdTagLine}/1`}
                                    class="w-32 hover:underline col-span-2 md:truncate md:text-ellipsis {participant.riotIdGameName ===
                                    game.participants[game.participantNumber].riotIdGameName
                                        ? 'font-bold'
                                        : ''}
                                        {game.gameMode === 'CLASSIC' ? (participant.teamPosition === '' ? 'text-red-600' : 'text-white') : 'text-white'}"
                                    on:click={() =>
                                        modalGameContext.update(val => ({
                                            ...val,
                                            isModalOpen: false,
                                        }))}
                                >
                                    {participant.riotIdGameName}
                                </a>

                                <!-- KDA -->
                                <div class="md:w-28 text-center">
                                    <p>{participant.kills} / {participant.deaths} / {participant.assists}</p>
                                    <p><strong>{kda(participant.kills, participant.deaths, participant.assists)}</strong> KDA</p>
                                </div>

                                <!-- CS, GOLD, VISION -->
                                <div class="md:grid md:w-48 grid-cols-3 text-center m-2">
                                    <p><strong>{participant.cs} cs</strong></p>
                                    <p><strong>{parse_k_num(participant.gold, 1)}</strong></p>
                                    <p><strong>{participant.visionScore} 👁</strong></p>
                                </div>

                                <!-- DAMAGES -->
                                <div class="grid grid-rows-2 gap-1">
                                    <!-- DAMAGE DEALT -->
                                    <div class="flex flex-col items-center">
                                        <span class="text-xs">{parse_k_num(participant.champ.damageDealt)}</span>
                                        <div class="h-2 w-20 rounded-sm bg-zinc-300 dark:bg-zinc-600">
                                            <div
                                                title="Damage dealt: {participant.champ.damageDealt}"
                                                class="h-2 rounded-sm bg-red-400"
                                                style="width: {(participant.champ.damageDealt /
                                                    Math.max(...game.participants.map(participant => participant.champ.damageDealt))) *
                                                    100}%"
                                            />
                                        </div>
                                    </div>

                                    <!-- DAMAGE TAKEN -->
                                    <div class="flex flex-col items-center">
                                        <div class="h-2 w-20 rounded-sm bg-zinc-300 dark:bg-zinc-600">
                                            <div
                                                title="Damage taken: {participant.champ.damageTaken}"
                                                class="h-2 rounded-sm bg-blue-400"
                                                style="width: {(participant.champ.damageTaken /
                                                    Math.max(...game.participants.map(participant => participant.champ.damageTaken))) *
                                                    100}%"
                                            />
                                        </div>
                                        <span class="text-xs">{parse_k_num(participant.champ.damageTaken)}</span>
                                    </div>
                                </div>

                                <!-- ITEMS -->
                                <div class="ml-2 grid grid-cols-7 col-span-3">
                                    {#each [0, 1, 2, 3, 4, 5] as itemId}
                                        <span>
                                            {#if participant.items[itemId]}
                                                <img
                                                    class="{styles.iconSize.large} ml-1 rounded"
                                                    src={riotService.itemURL(participant.items[itemId])}
                                                    alt="item"
                                                />
                                            {:else}
                                                <div class="{styles.iconSize.large} ml-1 rounded bg-gradient-to-br from-zinc-500 to-zinc-800" />
                                            {/if}
                                        </span>
                                    {/each}
                                    <img class="{styles.iconSize.large} ml-1 rounded" src={riotService.itemURL(participant.ward)} alt="guard" />
                                </div>
                            </div>
                        {/each}
                    </section>
                </div>
            {/if}
        </div>
    {/if}
</dialog>

<style>
    dialog::backdrop {
        background-color: rgba(12, 12, 12, 0.5);
        /* From https://css.glass */
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(8.7px);
        -webkit-backdrop-filter: blur(8.7px);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
</style>
