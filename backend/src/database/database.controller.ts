import { Controller, Get, Logger } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DatabaseService } from './database.service'

@ApiTags('database')
@Controller('database')
export class DatabaseController {
    private readonly logger: Logger

    constructor(private readonly databaseService: DatabaseService) {
        this.logger = new Logger(this.constructor.name)
    }

    /**
     * ## Reset all database registers
     * @returns Confirmation that the database was deleted
     */
    @Get('/reset')
    @ApiOperation({
        summary: 'Clean all data',
        description: 'Reset the Redis database, clearing all data',
    })
    @ApiResponse({
        status: 200,
        description: 'All data was cleaned',
        type: Boolean,
    })
    async reset(): Promise<boolean> {
        this.logger.verbose('Clear all data from redis')
        return this.databaseService.reset()
    }
}
