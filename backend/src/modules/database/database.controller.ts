import { Controller, Delete, Get, Logger, NotFoundException, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ParamServer, ParamSummonerName } from '../../common/decorators'
import { PrintDatabaseDto, RedisRecordGamesDto, RedisRecordMasteriesDto } from '../../common/types'
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
     * ## Get masteries
     * @returns Confirmation that the database was deleted
     */
    @Get('/print/:server/:summonerName/masteries')
    @ApiOperation({
        summary: 'Get masteries',
    })
    @ApiResponse({
        status: 200,
        type: RedisRecordMasteriesDto,
    })
    @ParamServer()
    @ParamSummonerName()
    async getMasteries(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<RedisRecordMasteriesDto> {
        const data = await this.databaseService.getGames(server, summonerName)

        if (!data) {
            throw new NotFoundException(`Masteries not found! Key: ${server}:${summonerName}:games`)
        }
        return this.databaseService.getMasteries(server, summonerName)
    }

    /**
     * ## Get games
     * @returns Confirmation that the database was deleted
     */
    @Get('/print/:server/:summonerName/games')
    @ApiOperation({
        summary: 'Get games',
    })
    @ApiResponse({
        status: 200,
        type: RedisRecordGamesDto,
    })
    @ParamServer()
    @ParamSummonerName()
    async getGames(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<RedisRecordGamesDto> {
        const data = await this.databaseService.getGames(server, summonerName)

        if (!data) {
            throw new NotFoundException(`Games not found! Key: ${server}:${summonerName}:games`)
        }
        return this.databaseService.getGames(server, summonerName)
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
     * ## Delete last element in the array
     * > useful to delete the last game and test without need to play another game
     * @returns Confirmation that the last item in thea array was deleted
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
