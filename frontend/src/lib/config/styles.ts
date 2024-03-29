export const styles = {
    background: 'bg-orange-50 dark:bg-zinc-900',
    foreground: 'bg-zinc-100 dark:bg-zinc-800',
    active: 'bg-indigo-400 dark:bg-indigo-700',
    card: 'rounded shadow hover:shadow-lg dark:shadow-zinc-700 hover:dark:shadow-indigo-700',
    border: 'border border-indigo-400 dark:border-indigo-700',
    game: {
        shadowDraw: 'hover:shadow-lg shadow-zinc-400',
        shadowWin: 'hover:shadow-lg shadow-green-400',
        shadowLose: 'hover:shadow-lg shadow-red-400',
    },
    scale: 'transition-transform hover:scale-105',
    iconSize: {
        small: 'w-[16px] h-[16px]',
        medium: 'w-[24px] h-[24px]',
        large: 'w-[32px] h-[32px]',
    },
    stat: {
        games: 'py-1 px-2 bg-green-300 dark:bg-green-800',
        winrate: 'py-1 px-2 bg-sky-300 dark:bg-sky-800',
        kills: 'py-1 px-2 bg-red-300 dark:bg-red-800',
        deaths: 'py-1 px-2 bg-zinc-400 dark:bg-zinc-400',
        kda: 'py-1 px-2 bg-purple-300 dark:bg-purple-800',
        cs: 'py-1 px-2 bg-yellow-300 dark:bg-yellow-800',
        assists: 'py-1 px-2 bg-pink-300 dark:bg-pink-800',
    },
} as const
