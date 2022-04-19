import { Injectable } from '@nestjs/common'

const api_key = process.env.RIOT_API_KEY

@Injectable()
export class SummonersService {
    getData(): any {
        return api_key ?? 5
    }
}
