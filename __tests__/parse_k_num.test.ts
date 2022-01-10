import { parse_k_num } from '../utils'

describe('[parse_k_num.ts]: parses a long number like "10.000.000" to "10.000k" or "10m"', () => {
    /* Parameters
        value:                number  - the number to parse
        number_decimals:      number  - how many decimals
        transform_millions:   boolean - if a 7 digit number must be converted to '7m' instead of '7000k'
    */

    const mock_values = [300, 4_000, 50_000, 600_000, 7_000_000, 80_000_000]

    const decimals = [0, 1, 2, 3]

    test('Millions not being converted, transform_millions = false', () => {
        mock_values.forEach(mock_value => {
            if (mock_value / 1000 < 1) {
                decimals.forEach(decimal => {
                    expect(parse_k_num(mock_value, decimal, false)).toBe(mock_value)
                })
            } else {
                decimals.forEach(decimal => {
                    expect(parse_k_num(mock_value, decimal, false)).toBe((mock_value / 1000).toFixed(decimal) + ' k')
                })
            }
        })
    })

    test('Millions being converted, transform_millions = true', () => {
        mock_values.forEach(mock_value => {
            if (mock_value / 1000 < 1) {
                decimals.forEach(decimal => {
                    expect(parse_k_num(mock_value, decimal, true)).toBe(mock_value)
                })
            } else if (mock_value >= 1000 && mock_value < 1000000) {
                decimals.forEach(decimal => {
                    expect(parse_k_num(mock_value, decimal, true)).toBe((mock_value / 1000).toFixed(decimal) + ' k')
                })
            } else {
                decimals.forEach(decimal => {
                    expect(parse_k_num(mock_value, decimal, true)).toBe((mock_value / 1000000).toFixed(decimal) + ' m')
                })
            }
        })
    })

    // test('Decimals', () => {

    // })
})
