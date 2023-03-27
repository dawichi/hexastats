import { Controller, Get, Logger } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RiotService } from './riot.service'

@ApiTags('riot')
@Controller('riot')
export class RiotController {
    private readonly logger: Logger

    constructor(private readonly riotService: RiotService) {
        this.logger = new Logger(this.constructor.name)
    }

    /**
     * ## Print all the database keys registered
     * @returns Response with the array of keys
     */
    @Get('/version')
    @ApiOperation({
        summary: 'Get the current version of the Game',
        description: 'Returns the current version of the game, example: 13.1.2',
    })
    @ApiResponse({
        status: 200,
        type: String,
    })
    async version(): Promise<string> {
        this.logger.log(`Current version: ${this.riotService.version}`)
        return this.riotService.version
    }
}
