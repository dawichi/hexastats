import FriendsDto from './Friends.dto'

export default function FriendsList({ friends }: { friends: FriendsDto }) {
    const WinrateProgressBar = ({ width }: { width: number }) => (
        <div className='bg-zinc-600 h-2 rounded'>
            <div className='bg-green-400 h-2 rounded' style={{ width: `${width}%` }} />
        </div>
    )

    const friendsList = Object.keys(friends).sort((a, b) => friends[b].games - friends[a].games)

    if (!friendsList.length) {
        return (
            <div className='p-5 text-center'>
                <span className='text-2xl'>
                    <i className='bi bi-emoji-frown'></i>
                </span>
                <p>There is games with friends loaded.</p>
            </div>
        )
    }

    return (
        <div className='p-4'>
            <section className='grid grid-cols-3 gap-2 mb-4'>
                <h4>Summoner</h4>
                <h4>Record</h4>
                <h4>Winrate</h4>
            </section>
            {friendsList.map((friend, idx) => (
                <section key={idx} className='grid grid-cols-3 gap-2'>
                    <span className='overflow-hidden'>{friend}</span>
                    <span>
                        {friends[friend].wins} / {friends[friend].games}
                    </span>
                    <span>
                        <WinrateProgressBar width={(friends[friend].wins / friends[friend].games) * 100} />
                    </span>
                </section>
            ))}
        </div>
    )
}
