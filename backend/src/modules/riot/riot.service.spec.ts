import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { RiotService } from './riot.service'

describe('RiotService', () => {
    let service: RiotService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule, ConfigModule],
            providers: [RiotService],
        }).compile()

        service = module.get<RiotService>(RiotService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
