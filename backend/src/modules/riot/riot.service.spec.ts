import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { RiotService } from './riot.service'
import { InternalServerErrorException } from '@nestjs/common'
import { RiotSummonerType } from 'src/common/schemas'

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

    describe('getBasicInfo', () => {
        it('should return summoner info when provided valid server and RiotIdDto', async () => {
            const server = 'test_server'
            const riotId = { name: 'test_name', tag: 'test_tag' }
            const expectedSummonerResponse: RiotSummonerType = {
                id: 'test_id',
                accountId: 'test_accountId',
                puuid: 'test_puuid',
                profileIconId: 123,
                revisionDate: Date.now(),
                summonerLevel: 30,
                name: 'Test Summoner',
            }

            jest.spyOn(service, 'getBasicInfo').mockResolvedValueOnce({
                ...expectedSummonerResponse,
                riotIdName: 'Test Summoner',
                riotIdTag: '1234',
            })

            const result = await service.getBasicInfo(server, riotId)

            expect(result).toBeDefined()
            expect(result.riotIdName).toEqual('Test Summoner')
            expect(result.riotIdTag).toEqual('1234')
        })

        it('should throw InternalServerErrorException when unable to parse response for puuid', async () => {
            const server = 'test_server'
            const riotId = { name: 'test_name', tag: 'test_tag' }

            jest.spyOn(service, 'getBasicInfo').mockRejectedValueOnce(new InternalServerErrorException())

            await expect(service.getBasicInfo(server, riotId)).rejects.toThrow(InternalServerErrorException)
        })

        afterEach(() => {
            jest.restoreAllMocks()
        })
    })
})
