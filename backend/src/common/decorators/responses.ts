import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

export function ApiCustomResponse(type: any) {
    return applyDecorators(
        ApiResponse({
            status: 200,
            description: 'The summoner was found and the data is correct',
            type,
        }),
    )
}
