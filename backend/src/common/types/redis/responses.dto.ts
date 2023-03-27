import { ApiProperty } from '@nestjs/swagger'

export class PrintDatabase {
    @ApiProperty({
        description: 'Total number of records in the database',
        example: 42,
    })
    total: number

    @ApiProperty({
        description: 'Keys stored in the database',
        type: [String],
    })
    keys: string[]
}
