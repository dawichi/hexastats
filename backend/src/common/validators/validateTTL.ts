import { Logger } from '@nestjs/common'

/**
 * ## Validate the TTL
 * Checks if the data has been stored more than 14 days ago,
 * comparing the timestamp of the data with the current time.
 *
 * @param {number} ttl Date.now() - when the register was created
 * @returns {boolean} If the TTL is still valid or not
 */
export const validateTTL = (ttl: number): boolean => {
    const logger = new Logger(validateTTL.name)
    const diff = Date.now() - ttl
    const diffDays = Math.floor(diff / 1000 / 60 / 60 / 24)
    const valid = diffDays < 14

    logger.log(`TTL is ${valid ? 'valid' : 'expired'}`)
    return valid
}
