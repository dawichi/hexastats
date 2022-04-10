import { Container } from 'components'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Contributor {
    name: string
    alias: string
    url: string
    bio: string | null
    image: string | null
    company: string | null
    location: string | null
    twitter: string | null
    followers: number
    following: number
    public_repos: number
}

export default function About() {
    const contributors = ['dawichi', 'Brr1-99', 'alexxwe']
    
    const [contributorsList, setContributorsList] = useState<Array<Contributor>>([])

    useEffect(() => {
        if (contributorsList.length < contributors.length) {
            for (const contributor of contributors) {
                // fetch data from github
                fetch(`https://api.github.com/users/${contributor}`)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.message) {
                            setContributorsList(contributorsList => [...contributorsList, {
                                name: data.name,
                                alias: data.login,
                                url: data.html_url,
                                bio: data.bio ?? '-',
                                image: data.avatar_url,
                                company: data.company ?? '-',
                                location: data.location ?? '-',
                                twitter: data.twitter_username ?? '-',
                                followers: data.followers,
                                following: data.following,
                                public_repos: data.public_repos,
                            }])
                        }
                    })
            }
        }
    }, [])

    // NOTE: Cards inspired by https://codepen.io/RocktimSaikia/pen/jObbBmR
    // Addapted with tailwindcss
    const ContributorCard = ({ contributor }) => (
        <div className="relative h-96 rounded-lg shadow bg-white dark:bg-zinc-800">
            <div className='absolute bg-indigo-400 left-0 top-0 h-24 w-full rounded-t-lg'></div>
            <span className='absolute top-2 left-2 text-white'>{contributor.company}</span>
            <span className='absolute top-2 right-2 text-white'>
                <a title='See project' href={'https://github.com/' + contributor.alias} target='_blank' rel='noreferrer'>
                    <i className='bi bi-github'></i>
                </a>
            </span>

            {/* Image */}
            <section className='relative top-0 left-0 h-32 w-32 mx-auto pt-8'>
                <div className='absolute h-32 w-32 rounded-full overflow-hidden shadow'>
                    <Image
                        src={contributor.image}
                        alt={contributor.name}
                        layout='fill'
                    />
                </div>
            </section>

            {/* Name */}
            <a href={contributor.url} target='_blank' rel='noreferrer'>
                <section className='mt-10 px-4'>
                    <p className='text-xl'>{contributor.name}</p>
                    <p className='text-md text-zinc-400'>@{contributor.alias}</p>
                    <p className='pt-2'>{contributor.bio}</p>
                    <p className='text-md text-zinc-400'>{contributor.location}</p>
                </section>
            </a>

            {/* Stats */}
            <section className='shadow-md dark:shadow-zinc-700 rounded border-0 border-t-2 border-indigo-400 grid grid-cols-3 mx-8 mt-3 p-3'>
                <div>
                    <p className='text-xl'>{contributor.followers}</p>
                    <p className='text-xs text-zinc-400'>Followers</p>
                </div>
                <div>
                    <p className='text-xl'>{contributor.following}</p>
                    <p className='text-xs text-zinc-400'>Following</p>
                </div>
                <div>
                    <p className='text-xl'>{contributor.public_repos}</p>
                    <p className='text-xs text-zinc-400'>Repositories</p>
                </div>
            </section>


        </div>
    )

    return (
        <Container title={'About us'} description={'Who is behind hexastats?'}>
            <div className='grid grid-cols-2 xl:grid-cols-4'>
                <div className='mx-auto text-center col-span-3 px-10'>
                    <p className='mb-5'>Hi! We are a small group of friends who wanted a way to easily compare ourselves instead of just checking out our respective opgg pages.</p>
                    <p className='mb-5'>After some research, we coded a simple script to get some basic info about our overall stats of our League of Legeds users.</p>
                    <p className='mb-5'>Eventually, because most people thought it could be a cool tool and wanted to try their usernames in the script, I decided to transform the idea into a web app with search system, so anyone could add themselves and their friends to make comparisons and have fun.</p>
                    <p className='mb-5'>Right now we keep working on it to improve it, adding new cool sections and new ways to interact with the data.</p>
                </div>
                <div className='h-48 w-80 relative mx-auto'>
                    <Image src='/images/gifs/coding.gif' alt='Coding' layout='fill' priority />
                </div>
            </div>

            <p className='mt-16 mb-5 text-xl'>The main plans are:</p>
            <ul>
                <li>🕑 Improve the time it takes to load the data from a player, by more than 90%</li>
                <li>🎮 Load automatically all players in a game when you enter in a new match</li>
            </ul>

            <div className='text-center mt-20'>
                <h2 className='text-2xl'>Creators</h2>
                <hr className='mt-5'/>
                <p className='my-5'>Feel free to contact us through our GitHub!</p>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {contributorsList.map((contributor, idx) => (
                        <div key={idx}>
                            <ContributorCard contributor={contributor} />
                        </div>
                    ))}
                </div>
            </div>

            <div className='text-center mt-20'>
                <h2 className='text-2xl'>Contribute</h2>
                <hr className='mt-5'/>
                <p className='my-5'>Do you want to contribute to Hexastats?</p>
                <p className='my-5'>Hexastats is Open Source and therefore you have the source code available via <a className='text-blue-500' href='https://github.com/dawichi/hexastats' target='_blank' rel='noreferrer'>github.com/dawichi/hexastats</a>.</p>
                <p>if you want to help us or propose new ideas, contact us through github or by creating an issue in <a className='text-blue-500' href='https://github.com/dawichi/hexastats/issues/new' target='_blank' rel='noreferrer'>here</a>!</p>
            </div>

            <div className='h-80 w-80 relative mx-auto mt-10'>
                <Image src='/images/gifs/peter.gif' alt='Coding' layout='fill' priority />
            </div>
        </Container>
    )
}
