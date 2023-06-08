import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export class LimitPipe implements PipeTransform<string, number> {
    transform(value: string): number {
        const val = parseInt(value, 10)

        if (isNaN(val)) throw new BadRequestException('Validation failed (limit is expected as a number)')
        if (val > 20) throw new BadRequestException('Validation failed (limit surpases the limit of 20)')
        return val
    }
}
