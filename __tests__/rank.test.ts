// import { render, screen } from '@testing-library/react'
import statTitle from '../utils/statTitle'

describe('[statTitle.ts]: converts a stat key in its Title (if listed inside the function)', () => {
    // Listed key: for example, 'winrate'
    test('Returns correctly "winrate" key', () => {
        expect(statTitle('winrate')).toBe('Winrate')
    })

    // Non listed keys
    test('Returns the same string if not listed as a stat', () => {
        expect(statTitle('1234')).toBe('1234')
    })
})
