/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Compare, Graphs, Home, Ranking } from '../sections'
import { Player } from '../interfaces/interfaces'
import { styles } from '../styles/styles.config'

// ┌────────────────┐
// │  INDEX PAGE:   │
// └────────────────┘
// Hexastats is a one-page app
// To navigate throgh the sections, is used a basic array with the sections available sections[]
// Based on the selected section, each component is showed in the <main> tag of the app
export default function Index(props: { data: any[] }) {
    // process the props.data to format the output into players_data
    const [currentSection, setCurrentSection] = useState(0)

    // Sections available
    // If you add a new section, remember modify also the navigation menu to be able to select its index
    const sections = [
        <Home key={0} data={props.data} />,
        <Graphs key={1} data={props.data} />,
        <Ranking key={2} data={props.data} />,
        <Compare key={3} data={props.data} />,
    ]

    return (
        <>
            <header style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <Navbar page={currentSection} setPage={setCurrentSection} />
            </header>

            <main className={`pb-20 dark:text-white ${styles.background}`}>
                <div className='animate__animated animate__fadeIn'>{sections[currentSection]}</div>
            </main>
        </>
    )
}

// Fetch data from euw.op.gg with getStaticProps()'s NextJS function
export const getStaticProps = async () => {
    const backend = 'https://hexastats-flask.vercel.app/?players='

    // whitelist
    const players = [
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
    players.sort(function (a, b) {
        a = a.toLocaleLowerCase()
        b = b.toLocaleLowerCase()
        if (a > b) return 1
        if (b > a) return -1
        return 0
    })

    const data: Player[] = []
    for (let idx = 0; idx < players.length; idx++) {
        let player_response = await axios.get(backend + players[idx])
        data.push(player_response.data)
    }

    return {
        props: { data: data },
    }
}
