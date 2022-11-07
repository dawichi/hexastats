export default interface FriendsDto {
    [friendName: string]: {
        games: number
        wins: number
    }
}
