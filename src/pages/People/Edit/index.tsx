import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

import { Message } from '~/components/Message'
import { upload } from '~/services'

interface UserInfoEdit {
  username: string
  avatar_url: string
  cover_url: string
  password: string
  bio: string
}

export const PeopleEdit = () => {
  const [username, token] = ['username', 'token'].map(
    (item) => localStorage.getItem(item) || '',
  )

  const [userInfo, setUserInfo] = useState<UserInfoEdit>({
    username: '',
    avatar_url: '',
    cover_url: '',
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

  const { data, error, isLoading } = useSWR(
    `/api/user/info/${username}`,
    fetcher,
  )

  useEffect(() => {
    if (data) {
      setUserInfo({
        username: data.username,
        avatar_url: data.avatar_url,
        cover_url: data.cover_url,
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

  // 这里应该...裁剪图片...图片以 base64 的形式展示，然后上传的时候再转成 blob
  // md 裁剪图片...
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    from: string,
  ) => {
    const files = e.target.files
    if (!files) return
    const tobe = []
    for (let i = 0; i < files.length; i++) {
      const { width, height } = await new Promise<{
        width: number
        height: number
      }>((resolve) => {
        const img = new Image()
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }
        img.src = URL.createObjectURL(files[i])
      })

      const { url } = await upload(files[i])
      tobe.push({ url, width, height })
    }

    const key = from === 'avatar' ? 'avatar_url' : 'cover_url'
    setUserInfo({
      ...userInfo,
      [key]: tobe[0].url,
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
    if (data) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      Message.success('修改成功，请重新登录')
    }
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
          <img
            src={import.meta.env.VITE_FURINA_APP_IMG_URL + userInfo.avatar_url}
            alt={userInfo.username}
            style={{ width: '100px' }}
          />
          <label htmlFor="avatar">avatar:</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'avatar')}
          />
        </div>
        <div>
          <img
            src={import.meta.env.VITE_FURINA_APP_IMG_URL + userInfo.cover_url}
            alt={userInfo.username}
            style={{ width: '100px' }}
          />
          <label htmlFor="cover">cover:</label>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'cover')}
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
