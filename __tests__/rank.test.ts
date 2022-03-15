// import { render, screen } from '@testing-library/react'
import statTitle from '../utils/statTitle'

describe('[rank.ts]: converts a stat key in its Title (if listed inside the function)', () => {
    // TODO: Create test for rank.ts
    // https://www.freecodecamp.org/news/testing-react-hooks/#:~:text=Unlike%20your%20react%20components%2C%20your%20tests%20are%20not,to%20import%20expect%20and%20describe%20into%20this%20file.

    // Listed key: for example, 'winrate'
    test('Returns correctly "winrate" key', () => {
        expect(statTitle('winrate')).toBe('Winrate')
    })

    // Non listed keys
    test('Returns the same string if not listed as a stat', () => {
        expect(statTitle('1234')).toBe('1234')
    })
})
