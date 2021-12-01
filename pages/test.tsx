import React, { useState } from 'react'

export default function Test () {
	const [inputValue, setInputValue] = useState('')
	const [userData, setUserData] = useState({
		user: '',
		error: '',
		data: ''
	})
	const [searching, setSearching] = useState(false)


	const handleSubmit = async (e) => {

		setSearching(true)
		e.preventDefault()
		fetch('/api/scrapper', {
			method: 'post',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				user: inputValue,
			}),
		})
			.then((res) => res.json())
			.then((userData) => {
				setSearching(false)
				console.log(userData)
				setUserData(userData)
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
			{ searching && <h1 className="bg-blue-400 p-3 m-2 w-40">Buscando ...</h1> }
			{ userData.data && 
				<p className="bg-green-400 p-3 m-2 w-40">DONE!</p>
			}
			{ userData.error && 
				<p className="bg-red-400 p-3 m-2 w-40">{userData.error}</p>
			}
		</>
	)
}