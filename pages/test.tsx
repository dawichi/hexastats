import React from 'react'

export default function Test () {
	const [inputValue, setInputValue] = React.useState('')
	const [userFollowers, setUserFollowers] = React.useState({
		user: '',
		followerCount: -1,
		error: ''
	})

	const handleSubmit = (e) => {
		e.preventDefault()
		fetch('/api/scrapper', {
			method: 'post',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ TWuser: inputValue }),
		})
			.then((res) => res.json())
			.then((userData) => {
				setUserFollowers(userData)
			})
	}
	return (
		<>
			<form onSubmit={handleSubmit}>
				<label>
					<input
					className="border m-2 p-2 bg-gray-200"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</label>
				<button>Submit</button>
			</form>
			{userFollowers.followerCount >= 0 ? (
				<p>Followers: {userFollowers.followerCount}</p>
			) : (
				<p>{userFollowers.error}</p>
			)}
		</>
	)
}