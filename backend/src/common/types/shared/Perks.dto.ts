import { ApiProperty } from '@nestjs/swagger'

export class Perks {
    @ApiProperty({
        description: 'URL to the image of the main rune',
        example:
            'https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/domination/electrocute/electrocute.png',
    })
    primary: string | null

    @ApiProperty({
        description: 'URL to the image of the group of secondary runes',
        example:
            'https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/7200_domination.png',
    })
    secondary: string | null
}
