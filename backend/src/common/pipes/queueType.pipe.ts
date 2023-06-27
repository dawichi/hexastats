import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { queueTypeDto } from 'src/modules/riot/riot.service'

@Injectable()
export class QueueTypePipe implements PipeTransform {
    transform(value: string): queueTypeDto {
        const valid_values = ['normal', 'ranked', 'all']

        console.log(value)
        if (valid_values.includes(value)) {
            return value as queueTypeDto
        }
        throw new BadRequestException('Validation failed (queueType is expected as [normal, ranked, all])')
    }
}
