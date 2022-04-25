import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { SummonersService } from './summoners.service'

describe('SummonersService', () => {
    let service: SummonersService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule, ConfigModule.forRoot()],
            providers: [SummonersService],
        }).compile()

        service = module.get<SummonersService>(SummonersService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
