import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { RankStructure } from '../../components'

describe('[RankStructure.tsx]: Renders a HTML structure with the rank data of a player', () => {
    afterEach(cleanup)

    test('should correctly "winrate" key', () => {
        const mock_player_rank = {
            rank: 'Diamond IV',
            image: 'test_url',
            lp: 25,
            win: 122,
            lose: 122,
            winrate: 43,
        }

        const { getByText } = render(<RankStructure title='TestTitle' rankdata={mock_player_rank} />)

        expect(getByText(mock_player_rank.rank).textContent).toBe('patata')
    })
})
