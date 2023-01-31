import { GameDto, MasteryDto } from '../../types'

export type RedisRecordDto = {
    ttl: number
    data: GameDto[] | MasteryDto[]
}
