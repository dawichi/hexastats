import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

/**
 * limit must be a number between 1 and 20
 */
@Injectable()
export class LimitPipe implements PipeTransform<string, number> {
    transform(value: string): number {
        const val = parseInt(value, 10)

        if (isNaN(val)) throw new BadRequestException('Validation failed (limit is expected as a number)')
        if (val <= 0 || val > 20) throw new BadRequestException('Validation failed (limit must be between 1 and 20)')
        return val
    }
}
