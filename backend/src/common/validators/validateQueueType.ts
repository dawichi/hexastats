/**
 * ## Validate Queue Type
 * The riot uses a certain query param depending of the queue type you want to check
 * @param queueType the option: ['ranked', 'normal']
 * @returns the query param to use
 */
export const validateQueueType = (queueType: string): string => {
    const queueTypes: { [key: string]: string } = {
        normal: '&type=normal',
        ranked: '&type=ranked',
    }

    return queueTypes[queueType] ?? '' // all queues
}
