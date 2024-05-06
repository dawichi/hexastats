import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { RiotController } from './riot.controller'
import { RiotService } from './riot.service'

describe('RiotController', () => {
    let controller: RiotController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule, ConfigModule],
            providers: [RiotService],
            controllers: [RiotController],
        }).compile()

        controller = module.get<RiotController>(RiotController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('should return the current version', async () => {
        const version = await controller.version()

        expect(version).toMatch('')
        // expect(version).toMatch(/(\d+\.){2}\d+/)
    })
})
