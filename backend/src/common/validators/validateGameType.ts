/**
 * ## Validate Game Type
 * The riot uses a certain query param depending of the queue type you want to check
 * https://static.developer.riotgames.com/docs/lol/queues.json
 *
 * @param queueId id of the queue in which the game takes place
 * @returns the query param to use
 */
export const validateGameType = (queueId: number): string => {
    const gameType: { [key: number]: string } = {
        400: 'Normal',
        420: 'Ranked Solo',
        430: 'Normal Blind',
        440: 'Ranked Flex',
        450: 'ARAM',
        700: 'Clash',
        720: 'ARAM Clash',
        830: 'Co-op IA',
        840: 'Co-op IA',
        850: 'Co-op IA',
        900: 'ARURF',
        920: 'Poro King',
        1010: 'Snow ARURF',
        1020: 'One for All',
        1090: 'Normal TFT',
        1100: 'Ranked TFT',
        1300: 'Nexus Blitz',
        1400: 'Spellbook',
        1700: 'Arena',
        1900: 'Pick URF',
        2000: 'Tutorial 1',
        2010: 'Tutorial 2',
        2020: 'Tutorial 3',
    }

    return gameType[queueId] ?? '' // all queues
}
