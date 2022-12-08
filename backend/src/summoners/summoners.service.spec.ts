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

    it('should return the basic summoner data', async () => {
        const summoner = await service.getBasicInfo('test', 'euw1')

        expect(summoner).toHaveProperty('accountId')
    })

    it('should return the latest version of the game', async () => {
        const version = await service.getLatestVersion()
        const versionNumber = version.split('.')

        expect(versionNumber).toHaveLength(3)
    })
})
