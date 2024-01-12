import { Controller, Delete, Get, Logger, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ParamServer, ParamRiotId } from '../../common/decorators'
import { RiotIdDto, StatsDto } from '../../common/types'
import { DatabaseService } from './database.service'
import { PrintKeysDto } from './types/responses.dto'
import { RiotIdPipe, ServerPipe } from '../../common/pipes'

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
        type: PrintKeysDto,
    })
    async printAll(): Promise<PrintKeysDto> {
        return this.databaseService.keys()
    }

    /**
     * ## Get masteries
     * @returns Confirmation that the database was deleted
     */
    @Get('/print/:server/:riotId/stats')
    @ApiOperation({
        summary: 'Get saved stats',
    })
    @ApiResponse({
        status: 200,
        type: StatsDto,
    })
    @ParamServer()
    @ParamRiotId()
    async getStats(@Param('server', ServerPipe) server: string, @Param('riotId', RiotIdPipe) riotId: RiotIdDto): Promise<StatsDto | null> {
        return this.databaseService.getStats(server, riotId)
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
    @Delete('/deleteLast/:server/:riotId')
    @ApiOperation({
        summary: 'Delete last value in the data array | Testing only',
        deprecated: true,
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ParamServer()
    @ParamRiotId()
    async deleteLast(@Param('server', ServerPipe) server: string, @Param('riotId', RiotIdPipe) riotId: RiotIdDto): Promise<boolean> {
        return this.databaseService.deleteLast(server, riotId)
    }
}
