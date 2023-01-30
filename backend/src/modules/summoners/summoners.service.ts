import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class SummonersService {
    private readonly logger = new Logger(this.constructor.name)
}
