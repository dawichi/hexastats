import { ApiProperty } from '@nestjs/swagger'

class RecordValue {
    @ApiProperty({
        description: 'Max value of the stat',
        example: 4,
    })
    value: number

    @ApiProperty({
        description: 'Match ID of the record',
        example: 4,
    })
    matchId: string
}

export class Record {
    kda: RecordValue
    kills: RecordValue
    deaths: RecordValue
    assists: RecordValue
    gold: RecordValue
    goldPerMin: RecordValue
    cs: RecordValue
    csPerMin: RecordValue
    vision: RecordValue
    visionPerMin: RecordValue
    matchDuration: RecordValue
    doubleKills: RecordValue
    tripleKills: RecordValue
    quadraKills: RecordValue
    pentaKills: RecordValue
}
