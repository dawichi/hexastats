import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { SummonersService } from './summoners.service'
import { RiotModule } from '../riot/riot.module'
import { DatabaseModule } from '../database/database.module'
import { MathModule } from '../math/math.module'
import { SummonersController } from './summoners.controller'

describe('SummonersService', () => {
    let service: SummonersService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, RiotModule, MathModule],
            providers: [SummonersService],
            controllers: [SummonersController],
        }).compile()

        service = module.get<SummonersService>(SummonersService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    // it('should return the basic summoner data', async () => {
    //     const riotId = { name: 'testName', tag: 'testTag' }
    //     const summoner = await service.getSummoner('euw1', riotId)

    //     expect(summoner).toHaveProperty('accountId')
    // })

    ////

    // riot.service
    // it('should return the latest version of the game', async () => {
    //     const version = await service.getLatestVersion()
    //     const versionNumber = version.split('.')

    //     expect(versionNumber).toHaveLength(3)
    // })
})
