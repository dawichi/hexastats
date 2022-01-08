export const backend = 'https://hexastats-flask.vercel.app/?players='

export const servers = ['euw', 'lan', 'las', 'na', 'kr', 'eune', 'tr', 'oce', 'ru', 'jp', 'br']

const whitelist = [
    'alexwwe',
    'Brr1',
    'BloddSword',
    'Dawichii',
    'Agazhord',
    'Traketero',
    'DryadZero',
    'Rhaast West',
    'DelemKi 26',
    'DAYTRESGP',
    'Telejenkem',
    'Ruzou',
    'TR0I',
]

// sort players alphabetically
export const players = whitelist.sort(function (a, b) {
    a = a.toLocaleLowerCase()
    b = b.toLocaleLowerCase()
    if (a > b) return 1
    if (b > a) return -1
    return 0
})
