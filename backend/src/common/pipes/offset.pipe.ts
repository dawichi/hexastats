import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

/**
 * offset must be a positive number
 */
@Injectable()
export class OffsetPipe implements PipeTransform {
    transform(value: string): number {
        const val = parseInt(value, 10)

        if (isNaN(val)) throw new BadRequestException('Validation failed (offset is expected as a number)')
        if (val < 0) throw new BadRequestException('Validation failed (offset must be greater than 0)')
        return val
    }
}
