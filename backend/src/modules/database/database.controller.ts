import { Controller, Delete, Get, Logger, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DatabaseService } from './database.service'
import { RedisRecordDto } from '../../common/types/RedisRecord.dto'
import { PrintDatabaseDto } from '../../common/types/PrintDatabase.dto'

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
        summary: 'Print all keys stored in the database',
    })
    @ApiResponse({
        status: 200,
        type: PrintDatabaseDto,
    })
    async printAll(): Promise<PrintDatabaseDto> {
        this.logger.log('Check all keys in redis')
        return this.databaseService.printAll()
    }

    /**
     * ## Reset all database registers
     * @returns Confirmation that the database was deleted
     */
    @Get('/print/:key')
    @ApiOperation({
        summary: 'Get data from a key',
    })
    @ApiResponse({
        status: 200,
        type: RedisRecordDto,
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
    @Delete('/reset')
    @ApiOperation({
        summary: 'Clear all data | try to avoid!',
        description: 'It flushes the whole Redis database, use it only if needed',
        deprecated: true,
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    async reset(): Promise<boolean> {
        this.logger.log('Clear all data from redis')
        return this.databaseService.deleteAll()
    }

    /**
     * ## Reset all database registers
     * @returns Confirmation that the database was deleted
     */
    @Delete('/delete/:key')
    @ApiOperation({
        summary: 'Delete all data from a key',
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiParam({
        name: 'key',
        type: String,
    })
    async delete(@Param('key') key: string): Promise<boolean> {
        return this.databaseService.deleteOne(key)
    }

    /**
     * ## Reset all database registers
     * @returns Confirmation that the database was deleted
     */
    @Delete('/deleteLast/:key')
    @ApiOperation({
        summary: 'Delete last value in the data array | Testing only',
        deprecated: true,
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiParam({
        name: 'key',
        description: 'Key to get the data from',
        type: String,
    })
    async deleteLast(@Param('key') key: string): Promise<boolean> {
        return this.databaseService.deleteLast(key)
    }
}
