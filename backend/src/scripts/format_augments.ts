import { writeFile } from 'node:fs/promises'
import { augmentsData } from '../common/data/raw-augments'

// no top level await
;(async () => {
    /**
     *  STEP 1. Download the data from
     *  https://utils.iesdev.com/static/json/lol/arena/13.14/augments_en_us
     *  and compare it against the data in raw-augments.ts
     */
    console.log('STEP 1. Comparing data from source with raw-augments.ts')

    const source = 'https://utils.iesdev.com/static/json/lol/arena/13.24/augments_en_us'
    const response = await fetch(source)
    const data = await response.json()
    const wrong_keys: Array<number> = []

    for (const [key, value] of Object.entries(data)) {
        const is_different = JSON.stringify(augmentsData[Number(key)]) !== JSON.stringify(value)

        if (is_different) {
            wrong_keys.push(Number(key))
        }
        console.log(`checking key: ${key} ${is_different ? '❌' : '✅'}`)
    }

    if (wrong_keys.length > 0) {
        console.log('\nThe following keys are different from source:', wrong_keys)
        throw new Error('Please check the keys above and fix them in raw-augments.ts')
    }

    /**
     * STEP 2. Format the data from raw-augments.ts and write it to augments.json
     */
    console.log('STEP 2. Formatting data from raw-augments.ts and writing it to augments.json')

    const formatted: typeof augmentsData = {}

    for (const key in augmentsData) {
        formatted[key] = augmentsData[key]!
        const matches = formatted[key]!.description.match(/@([a-zA-Z0-9*]+)@/g)

        if (matches) {
            for (const match of matches) {
                if (match.includes('*')) {
                    // the expression must be evaluated because it contains a multiplication: @damage*100@
                    const variable = match.slice(1, -1).split('*')[0]
                    const var_value = formatted[key]!.spellDataValues[String(variable)]!.toFixed(2)

                    formatted[key]!.description = formatted[key]!.description.replace(
                        match,
                        eval(match.slice(1, -1).replace(String(variable), var_value)),
                    )
                } else {
                    // its just a variable like @damage@ so, a simple replace
                    const spellDataKey = match.replace('@', '').replace('@', '')
                    const var_value: string = formatted[key]!.spellDataValues[spellDataKey]
                        ? String(formatted[key]!.spellDataValues[spellDataKey])
                        : ''

                    formatted[key]!.description = formatted[key]!.description.replace(match, var_value).replace('  ', ' ')
                }
            }
        }
        formatted[key]!.description = formatted[key]!.description.replace(/<[^>]*>/g, '')
    }

    console.log('Writing the Map to augments.ts')
    await writeFile(
        'src/common/data/augments.ts',
        `
import { RiotAugmentDto } from '../../modules/riot/types'      

export const augmentsData: Record<number, RiotAugmentDto> = ${JSON.stringify(formatted)}`,
    )
})()
