import { Test, TestingModule } from '@nestjs/testing'
import { RiotService } from './riot.service'

describe('RiotService', () => {
    let service: RiotService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RiotService],
        }).compile()

        service = module.get<RiotService>(RiotService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
