import { ApiProperty } from '@nestjs/swagger'
import { GameDto, MasteryDto } from '../../types'

export class RedisRecordDto {
    @ApiProperty({
        description: 'ttl of the record, in milliseconds',
        example: 1620000000000,
    })
    ttl: number

    @ApiProperty({
        description: 'Data stored in the record',
        type: [GameDto, MasteryDto],
    })
    data: GameDto[] | MasteryDto[]
}
