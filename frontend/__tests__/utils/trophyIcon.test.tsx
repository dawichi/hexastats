import { trophyIcon } from 'utils'

describe('[trophyIcon.tsx]: returns a <span> with the trophy or empty', () => {
    test('Should return a trophy if the number is in range', () => {
        const silver = trophyIcon(2)
        expect(silver.props.children).toStrictEqual(<i className='bi bi-trophy' />)
    })

    test('Should return a empty <span> if the number is out of range', () => {
        const out1 = trophyIcon(-5)
        const out2 = trophyIcon(17)
        expect(out1.props.children).toBe(undefined)
        expect(out2.props.children).toBe(undefined)
    })
})
