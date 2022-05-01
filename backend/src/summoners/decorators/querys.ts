import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export function ChampsLimitQuery() {
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

export function GamesLimitQuery() {
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

export function MasteriesLimitQuery() {
    return applyDecorators(
        ApiQuery({
            name: 'masteriesLimit',
            description: 'Limit of masteries to be returned. Empty defaults to 24',
            example: 24,
            type: Number,
            required: false,
        }),
    )
}

export function OffsetQuery() {
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
