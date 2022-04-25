import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { SummonersService } from './summoners.service'
import { SummonersController } from './summoners.controller'

describe('SummonersController', () => {
    let controller: SummonersController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule, ConfigModule],
            providers: [SummonersService],
            controllers: [SummonersController],
        }).compile()

        controller = module.get<SummonersController>(SummonersController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
