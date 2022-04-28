import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export function ChampsLimitQuery() {
    return applyDecorators(
        ApiQuery({
            name: 'champsLimit',
            description: 'Limit of champs to be returned',
            example: 7,
            type: Number,
            required: false,
        }),
    )
}

export function GamesLimitQuery() {
    return applyDecorators(
        ApiQuery({
            name: 'gamesLimit',
            description: 'Limit of last games played to load. Max: 100. A high number (+30) usually implies a lot of load time to respond',
            example: 20,
            type: Number,
            required: false,
        }),
    )
}

export function MasteriesLimitQuery() {
    return applyDecorators(
        ApiQuery({
            name: 'masteriesLimit',
            description: 'Limit of masteries to be returned',
            example: 7,
            type: Number,
            required: false,
        }),
    )
}

export function QueueTypeQuery() {
    return applyDecorators(
        ApiQuery({
            name: 'queueType',
            description: 'Specify a queue type to check only a specific type of game. Default checks only rankeds.',
            enum: ['normal', 'ranked', 'all'],
            example: 'ranked',
            required: false,
        }),
    )
}
