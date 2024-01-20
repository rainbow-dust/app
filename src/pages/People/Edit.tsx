import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

interface UserInfoEdit {
  username: string
  avatar_url: string
  password: string
  bio: string
}

export const Edit = () => {
  const [username, token] = ['username', 'token'].map(
    (item) => localStorage.getItem(item) || '',
  )

  const [userInfo, setUserInfo] = useState<UserInfoEdit>({
    username: '',
    avatar_url: '',
    password: '',
    bio: '',
  })

  const fetcher = (url: string) =>
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json())

  const { data, error, isLoading } = useSWR(`/api/user/${username}`, fetcher)

  useEffect(() => {
    if (data) {
      setUserInfo({
        username: data.username,
        avatar_url: data.avatar_url,
        password: '',
        bio: data.bio,
      })
    }
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInfo({
      ...userInfo,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch(`/api/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...userInfo,
      }),
    })
    const data = await res.json()
    console.log(data)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={userInfo.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="avatar_url">avatar_url</label>
          <input
            type="text"
            name="avatar_url"
            id="avatar_url"
            value={userInfo.avatar_url}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={userInfo.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="bio">bio</label>
          <input
            name="bio"
            id="bio"
            value={userInfo.bio}
            onChange={handleChange}
          />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}
