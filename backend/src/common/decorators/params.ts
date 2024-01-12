import { applyDecorators } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger'
import { ServerSchema } from '../schemas'

export function ParamServer() {
    return applyDecorators(
        ApiParam({
            name: 'server',
            description: 'Server to search the player in',
            enum: Object.values(ServerSchema.Values),
        }),
    )
}

export function ParamRiotId() {
    return applyDecorators(
        ApiParam({
            name: 'riotId',
            description: 'RiotID with format name#tag',
            type: String,
        }),
    )
}
