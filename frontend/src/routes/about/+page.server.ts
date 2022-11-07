import type { ContributorDto } from './contributor.dto'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const names = ['dawichi', 'Brr1-99', 'alexxwe']
    const contributors: ContributorDto[] = []

    for (const contributor of names) {
        const res = await fetch(`https://api.github.com/users/${contributor}`)
        const data = await res.json()
        contributors.push({
            name: data.name,
            alias: data.login,
            url: data.html_url,
            bio: data.bio ?? '-',
            blog: data.blog ?? '-',
            image: data.avatar_url ?? 'https://avatars.githubusercontent.com/u/51042900?v=4',
            company: data.company ?? '-',
            location: data.location ?? '-',
            followers: data.followers,
            following: data.following,
            public_repos: data.public_repos,
            twitter: data.twitter_username ?? '-',
        })
    }

    return {
        contributors,
    }
}
