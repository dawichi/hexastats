import { Controller, Get, Logger } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MathService } from './math.service'

@ApiTags('math')
@Controller('math')
export class MathController {
    private readonly logger: Logger

    constructor(private readonly mathService: MathService) {
        this.logger = new Logger(this.constructor.name)
    }

    /**
     * ## Print all the database keys registered
     * @returns Response with the array of keys
     */
    // @Get('/print')
    // @ApiOperation({
    //     summary: 'Print all keys stored in the database',
    // })
    // @ApiResponse({
    //     status: 200,
    //     type: PrintDatabaseDto,
    // })
    // async printAll() {
    //     this.logger.log('Check all keys in redis')
    //     return 'this.mathService.printAll()'
    // }
}
