import { Test, TestingModule } from '@nestjs/testing'
import { SummonersService } from './summoners.service'

describe('SummonersService', () => {
    let service: SummonersService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SummonersService],
        }).compile()

        service = module.get<SummonersService>(SummonersService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
