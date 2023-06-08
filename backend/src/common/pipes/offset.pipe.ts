import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export class OffsetPipe implements PipeTransform {
    transform(value: string): number {
        const val = parseInt(value, 10)

        if (isNaN(val)) throw new BadRequestException('Validation failed (offset is expected as a number)')
        return val
    }
}
