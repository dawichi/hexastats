import { ApiProperty } from '@nestjs/swagger'

export class Augment {
    @ApiProperty({
        description: 'Description of the augment',
        example: 'There is a tether between you and your partner that constantly damages enemies inside.',
    })
    description: string

    @ApiProperty({
        description: 'Display name of the augment',
        example: 'Clothesline',
    })
    displayName: string

    @ApiProperty({
        description: 'Image of the augment - large',
        example: 'GoreDrink_large.Arena_Augments_V2.png',
    })
    iconLarge: string

    @ApiProperty({
        description: 'Image of the augment - small',
        example: 'GoreDrink_small.Arena_Augments_V2.png',
    })
    iconSmall: string

    @ApiProperty({
        description: 'ID of the augment',
        example: 110,
    })
    id: number

    @ApiProperty({
        description: 'Name of the augment',
        example: 'Clothesline',
    })
    name: string

    @ApiProperty({
        description: 'Tooltip of the augment',
        example:
            'There is a tether between you and your partner that deals  magic damage per second.Damage Dealt this Round: Damage Dealt Total: ',
    })
    tooltip: string
}
