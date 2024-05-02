import { Test, TestingModule } from '@nestjs/testing'
import { SummonersService } from './summoners.service'
import { RiotService } from '../../modules/riot/riot.service'
import { DatabaseService } from '../database/database.service'
import { MathService } from '../math/math.service'
import { QueueType } from '../../common/schemas'
import { RiotIdDto, RankDataDto, PlayerDto, MasteryDto, GameNormalDto, GameArenaDto } from '../../common/types'

describe('SummonersService', () => {
    let service: SummonersService
    let riotService: RiotService
    // let databaseService: DatabaseService
    let mathService: MathService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SummonersService,
                {
                    provide: RiotService,
                    useValue: {
                        getBasicInfo: jest.fn(),
                        getRankData: jest.fn(),
                        getMasteries: jest.fn(),
                        getGameIds: jest.fn(),
                        getGamesDetail: jest.fn(),
                        getGameDetail: jest.fn(),
                        isLastGame: jest.fn(),
                        version: '11.6.1',
                    },
                },
                {
                    provide: DatabaseService,
                    useValue: {
                        getStats: jest.fn(),
                        set: jest.fn(),
                    },
                },
                {
                    provide: MathService,
                    useValue: {
                        getFriends: jest.fn(),
                        getStatsByChamp: jest.fn(),
                        getStatsByPosition: jest.fn(),
                        getRecords: jest.fn(),
                        mergeStats: jest.fn(),
                    },
                },
            ],
        }).compile()

        service = module.get<SummonersService>(SummonersService)
        riotService = module.get<RiotService>(RiotService)
        // databaseService = module.get<DatabaseService>(DatabaseService)
        mathService = module.get<MathService>(MathService)

        //Mocked Functions
        ;(riotService.getBasicInfo as jest.Mock).mockResolvedValue({
            id: 'summonerId',
            riotIdName: 'SummonerName',
            riotIdTag: '1234',
            profileIconId: 123,
            summonerLevel: 30,
        })
        ;(riotService.getRankData as jest.Mock).mockResolvedValue({
            solo: {
                rank: 'Gold',
                image: 'gold.png',
                lp: 86,
                win: 20,
                lose: 20,
                winrate: 50,
            },
            flex: {
                rank: 'Silver',
                image: 'silver.png',
                lp: 75,
                win: 15,
                lose: 25,
                winrate: 38,
            },
            arena: {
                rank: 'Gold',
                image: 'gold.png',
                lp: 100,
                win: 30,
                lose: 10,
                winrate: 75,
            },
        })
        ;(riotService.getMasteries as jest.Mock).mockResolvedValue([])
        ;(riotService.getGameIds as jest.Mock).mockResolvedValue([])
        ;(riotService.getGamesDetail as jest.Mock).mockResolvedValue([])
        ;(mathService.getFriends as jest.Mock).mockResolvedValue([])
        ;(mathService.getRecords as jest.Mock).mockResolvedValue([])
        ;(mathService.getStatsByChamp as jest.Mock).mockResolvedValue([])
        ;(mathService.getStatsByPosition as jest.Mock).mockResolvedValue([])
        ;(mathService.mergeStats as jest.Mock).mockResolvedValue([])
        // ;(databaseService.getStats as jest.Mock).mockResolvedValue([])
        // ;(databaseService.set as jest.Mock).mockResolvedValue([])
        ;(riotService.isLastGame as jest.Mock).mockResolvedValue([])
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getSummoner', () => {
        it('should format rank data with expected structure', async () => {
            const riotId: RiotIdDto = { name: 'example', tag: '1234' }
            const expectedSummoner: RankDataDto = {
                alias: 'SummonerName',
                riotIdName: 'SummonerName',
                riotIdTag: '1234',
                server: 'euw',
                image: 'https://ddragon.leagueoflegends.com/cdn/11.6.1/img/profileicon/123.png',
                level: 30,
                rank: {
                    solo: {
                        rank: 'Gold',
                        image: 'gold.png',
                        lp: 86,
                        win: 20,
                        lose: 20,
                        winrate: 50,
                    },
                    flex: {
                        rank: 'Silver',
                        image: 'silver.png',
                        lp: 75,
                        win: 15,
                        lose: 25,
                        winrate: 38,
                    },
                    arena: {
                        rank: 'Gold',
                        image: 'gold.png',
                        lp: 100,
                        win: 30,
                        lose: 10,
                        winrate: 75,
                    },
                },
            }

            const result = await service.getSummoner('euw', riotId)

            expect(result).toEqual(expectedSummoner)
        })
    })

    describe('getLevelImage', () => {
        it('should format profile info with expected structure', async () => {
            const riotId: RiotIdDto = { name: 'example', tag: '1234' }
            const expectedLevelImage: PlayerDto = {
                alias: 'SummonerName',
                riotIdName: 'SummonerName',
                riotIdTag: '1234',
                server: 'euw',
                image: 'https://ddragon.leagueoflegends.com/cdn/11.6.1/img/profileicon/123.png',
                level: 30,
            }

            const result = await service.getLevelImage('euw', riotId)

            expect(result).toEqual(expectedLevelImage)
        })
    })

    describe('getMasteries', () => {
        it('should format masteries with expected structure', async () => {
            const riotId: RiotIdDto = { name: 'example', tag: '1234' }
            const expectedMasteries: MasteryDto[] = []

            const result = await service.getMasteries('euw', riotId, 10)

            expect(result).toEqual(expectedMasteries)
        })
    })

    describe('getGames', () => {
        it('should format game data with expected structure', async () => {
            const riotId: RiotIdDto = { name: 'example', tag: '1234' }
            const queueType: QueueType = 'all' //or 'ranked' or 'normal'
            const expectedGames: Array<GameNormalDto | GameArenaDto> = []

            const result = await service.getGames('euw', riotId, 10, 0, queueType)

            expect(result).toEqual(expectedGames)
        })
    })
})
