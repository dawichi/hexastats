import { Logger } from '@nestjs/common'

/**
 * ## Validate the TTL
 * Checks if the data has been stored more than 24h ago,
 * comparing the timestamp of the data with the current time.
 *
 * @param {number} ttl Date.now() - when the register was created
 * @returns {boolean} If the TTL is still valid or not
 */
export const validateTTL = (ttl: number): boolean => {
    const logger = new Logger(validateTTL.name)
    const diff = Date.now() - ttl
    const diffHours = Math.floor(diff / 1000 / 60 / 60)
    const valid = diffHours < 24

    if (valid) {
        logger.log(`TTL is still valid: ${24 - diffHours} hours left`)
    } else {
        logger.log(`TTL is expired: ${diffHours - 24} hours ago`)
    }

    return valid
}
