import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ServerSchema, ServerType } from '../schemas'

@Injectable()
export class ServerPipe implements PipeTransform {
    transform(value: string): ServerType {
        const result = ServerSchema.safeParse(value)

        if (!result.success) {
            throw new BadRequestException(`Validation failed (server is expected as [${Object.values(ServerSchema.Values)}])`)
        } else {
            return result.data
        }
    }
}
