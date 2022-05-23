import Image from 'next/image'

/**
 * ## Displays the level and image of a player
 * The level is displayed in a circle over the image of the player
 *
 * @param player the player to display
 * @param player.image url to the image
 * @param player.alias name of the player
 * @param player.level level of the player
 * @param player.margin optional margin to add to the image
 */
const PlayerImg = ({
    image,
    alias = 'playerImg',
    level = 0,
    margin = 'm-3',
}: {
    image: string
    alias?: string
    level?: number
    margin?: string
}): JSX.Element => (
    <div className={`relative flex flex-col items-center text-sm text-white w-14 h-14 rounded ${margin}`}>
        <Image className='rounded-md' src={image} layout='fill' alt={alias} />
        <span className='px-1 absolute -bottom-2 bg-zinc-700 border border-yellow-500 rounded-full'>{level}</span>
    </div>
)

export default PlayerImg
