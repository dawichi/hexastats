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
     * ## Print all the database keys registered
     * @returns Response with the array of keys
     */
    @Get('/print')
    @ApiOperation({
        summary: 'Print all keys registered',
        description: 'Print all keys registered in the Redis database',
    })
    @ApiResponse({
        status: 200,
        description: 'All the keys was checked',
        type: [String],
    })
    async checkAll(): Promise<string[]> {
        this.logger.verbose('Check all keys in redis')
        return this.databaseService.checkAll()
    }

    /**
     * ## Reset all database registers
     * @returns Confirmation that the database was deleted
     */
    @Get('/reset')
    @ApiOperation({
        summary: 'Clear all data',
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
