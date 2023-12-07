import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { QueueSchema, QueueType } from '../schemas'

/**
 * queueType must be one of the expected values
 */
@Injectable()
export class QueueTypePipe implements PipeTransform {
    transform(value: string): QueueType {
        const result = QueueSchema.safeParse(value)

        if (!result.success) {
            throw new BadRequestException(`'queueType' parameter validation: ${result.error.errors[0]?.message}`)
        }

        return result.data
    }
}
