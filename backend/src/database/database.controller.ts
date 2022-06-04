import { Controller, Get, Logger, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ParamServer, ParamSummonerName } from 'src/summoners/decorators'
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
        return this.databaseService.printKeys()
    }

    /**
     * ## Reset all database registers
     * @returns Confirmation that the database was deleted
     */
    @Get('/print/:server/:summonerName')
    @ApiOperation({
        summary: 'Get data from a key',
        description: 'Print all the data stored in a key',
    })
    @ApiResponse({
        status: 200,
        description: 'Data returned',
        type: Boolean,
    })
    @ParamServer()
    @ParamSummonerName()
    async printByKey(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<any> {
        this.logger.verbose(`Getting data from ${server}:${summonerName} in redis`)
        return this.databaseService.getData(server, summonerName)
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
        return this.databaseService.flushDb()
    }
}
