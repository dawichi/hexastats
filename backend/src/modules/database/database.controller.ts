import { Controller, Get, Logger, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DatabaseService } from './database.service'
import { PlayerDto } from '../../types'
import { RedisRecordDto } from '../../common/types/RedisRecord.dto'

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
    async checkAll(): Promise<{ total: number; keys: string[] }> {
        this.logger.log('Check all keys in redis')
        const keys = await this.databaseService.list()
        const total = await this.databaseService.count()

        return { total, keys }
    }

    /**
     * ## Reset all database registers
     * @returns Confirmation that the database was deleted
     */
    @Get('/print/:key')
    @ApiOperation({
        summary: 'Get data from a key',
        description: 'Print all the data stored in a key',
    })
    @ApiResponse({
        status: 200,
        description: 'Data returned',
        type: PlayerDto,
    })
    @ApiParam({
        name: 'key',
        description: 'Key to get the data from',
        type: String,
    })
    async printByKey(@Param('key') key: string): Promise<RedisRecordDto> {
        this.logger.log(`Getting data from ${key} in redis`)
        return this.databaseService.getOne(key)
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
        this.logger.log('Clear all data from redis')
        return this.databaseService.deleteAll()
    }
}
