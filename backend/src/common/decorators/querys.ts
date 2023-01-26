import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export function QueryGamesLimit() {
    return applyDecorators(
        ApiQuery({
            name: 'gamesLimit',
            description: 'Limit of last games played to load. Empty defaults to 10',
            example: 10,
            type: Number,
            required: false,
        }),
    )
}

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
