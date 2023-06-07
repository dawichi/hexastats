import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export function QueryLimit() {
    return applyDecorators(
        ApiQuery({
            name: 'limit',
            description: 'Limit of last games played to load. Empty defaults to 10',
            example: 10,
            type: Number,
            required: true,
        }),
    )
}

export function QueryOffset() {
    return applyDecorators(
        ApiQuery({
            name: 'offset',
            description: 'Offset of last games played to load. Empty defaults to 10',
            example: 0,
            type: Number,
            required: true,
        }),
    )
}

// UNUSED
export function QueryQueueType() {
    return applyDecorators(
        ApiQuery({
            name: 'queueType',
            description: 'Specify a queue type to check only a specific type of game. Empty checks both.',
            enum: ['normal', 'ranked'],
            example: 'ranked',
            required: false,
        }),
    )
}
