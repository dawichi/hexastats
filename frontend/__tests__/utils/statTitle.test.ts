import { statTitle } from 'utils'

describe('[statTitle.ts]: returns a formatted Title', () => {
    test('Should return a different string if it is in the props object', () => {
        const mock_prop = 'games'

        expect(statTitle(mock_prop)).not.toBe(mock_prop)
    })

    test('Should return the same string if it is not in the props object', () => {
        const mock_prop = 'some text'

        expect(statTitle(mock_prop)).toBe(mock_prop)
    })
})
