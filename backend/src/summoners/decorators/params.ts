import { applyDecorators } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger'

export function ServerParam() {
    return applyDecorators(
        ApiParam({
            name: 'server',
            description: 'Server to search the player in',
            enum: ['euw1', 'na1', 'eun1', 'kr', 'jp1', 'br1', 'la1', 'la2', 'oc1', 'tr1', 'ru'],
        }),
    )
}

export function SummonerNameParam() {
    return applyDecorators(
        ApiParam({
            name: 'summonerName',
            description: 'Alias of the summoner in game',
            type: String,
        }),
    )
}
