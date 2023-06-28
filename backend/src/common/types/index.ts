// summoners/
export { Game as GameDto } from './shared/Game.dto'
export { GameDetail as GameDetailDto } from './shared/GameDetail.dto'
export { Mastery as MasteryDto } from './shared/Mastery.dto'
export { Rank as RankDto } from './shared/Rank.dto'
export { Player as PlayerDto } from './shared/Player.dto'
export { RankData as RankDataDto } from './shared/Player.dto'

export { Friend as FriendDto } from './shared/Stats.dto'
export { ChampStats as ChampStatsDto } from './shared/Stats.dto'
export { PositionStats as PositionStatsDto } from './shared/Stats.dto'
export { Stats as StatsDto } from './shared/Stats.dto'
export { Record as RecordDto } from './shared/Record.dto'

// redis/
// export { RedisRecordGames as RedisRecordGamesDto } from './redis/RedisRecord.dto'
// export { RedisRecordMasteries as RedisRecordMasteriesDto } from './redis/RedisRecord.dto'
export { PrintDatabase as PrintDatabaseDto } from './redis/responses.dto'
