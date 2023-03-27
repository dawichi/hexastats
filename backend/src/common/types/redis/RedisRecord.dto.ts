import { ApiProperty } from '@nestjs/swagger'
import { GameDto, MasteryDto } from '..'

class RedisBaseRecord {
    @ApiProperty({
        description: 'ttl of the record, in milliseconds',
        example: 1620000000000,
    })
    ttl: number
}

export class RedisRecordGames extends RedisBaseRecord {
    @ApiProperty({
        description: 'Games stored in the record',
        type: [GameDto],
    })
    data: GameDto[]
}

export class RedisRecordMasteries extends RedisBaseRecord {
    @ApiProperty({
        description: 'Masteries stored in the record',
        type: [MasteryDto],
    })
    data: MasteryDto[]
}
