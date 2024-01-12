import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { RiotIdDto } from '../types'

/**
 * RiotID must have a valid format
 */
@Injectable()
export class RiotIdPipe implements PipeTransform {
    transform(value: string): RiotIdDto {
        const [name, tag] = value.split('#')

        if (!name || !tag) {
            throw new BadRequestException(`'RiotId' parameter validation: must be name#tag`)
        }

        return {
            name: encodeURI(name.trim()),
            tag,
        }
    }
}
