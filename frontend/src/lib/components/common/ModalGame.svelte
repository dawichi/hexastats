<!--
  @component
  ## ModalGame
  used to display a game inside a modal
-->
<script lang="ts">
    import { modalGameContext } from '$lib/context/modalGame'
    import type { GameDetailDto } from '$lib/types'

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

    // This memo the state to prevent multiple calls
    let isModalOpen = false
    $: modalGameContext.subscribe(val => {
        // Skip re-render if the value is the same
        if (val.isModalOpen === isModalOpen) return

        // Update the memo and run the logic
        isModalOpen = val.isModalOpen
        val.isModalOpen ? modal.open() : modal.close()
    })

    let game: GameDetailDto
    async function getGame() {
        const response = await fetch(`http://localhost:5000/summoners/euw1/Dawichii/games/EUW1_6479724132`)
        game = await response.json()
    }
    getGame()
</script>

{$modalGameContext.isModalOpen ? 'opened V' : 'closed X'}
<button
    on:click={() =>
        modalGameContext.update(val => ({
            ...val,
            isModalOpen: true,
        }))}
>
    OPEN
</button>

<dialog data-modal-game>
    {#if game}
        <div>
            {game.matchId}
        </div>
    {/if}
    <button on:click={() =>
        modalGameContext.update(val => ({
            ...val,
            isModalOpen: false,
        }))}> CLOSE </button>
</dialog>

<style>
    dialog::backdrop {
        background-color: rgba(12, 12, 12, 0.5);
    }
</style>
