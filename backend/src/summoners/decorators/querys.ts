import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export function QueryChampsLimit() {
    return applyDecorators(
        ApiQuery({
            name: 'champsLimit',
            description: 'Limit of champs to be returned. Empty defaults to 7',
            example: 7,
            type: Number,
            required: false,
        }),
    )
}

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

export function QueryMasteriesLimit() {
    return applyDecorators(
        ApiQuery({
            name: 'masteriesLimit',
            description: 'Limit of masteries to be returned. 0 returns all',
            example: 24,
            type: Number,
            required: true,
        }),
    )
}

export function QueryOffset() {
    return applyDecorators(
        ApiQuery({
            name: 'offset',
            description: 'Skip a number of games before starting to analyze',
            example: 0,
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
