import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ServerSchema, ServerType } from '../schemas'

/**
 * server must be one of the expected values
 */
@Injectable()
export class ServerPipe implements PipeTransform {
    transform(value: string): ServerType {
        const result = ServerSchema.safeParse(value)

        if (!result.success) {
            throw new BadRequestException(`'server' parameter validation: ${result.error.errors[0]?.message}`)
        }

        return result.data
    }
}
