import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

import { Popup, useModal } from '~/components/Modal'
import { cancelFollow, follow } from '~/services'

import Classes from './BaseInfo.module.css'
import { PeopleList } from './components/PeopleList'

export interface UserInfo {
  username: string
  avatar_url: string
  cover_url: string
  password: string
  bio: string
  followees: UserInfo[]
  followers: UserInfo[]
  is_following: boolean
  mutual_follows?: UserInfo[]

  be_liked_count: number
  be_collected_count: number
  note_count: number
}

export const BaseInfo = ({ username }: { username: string }) => {
  const navigate = useNavigate()
  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((res) => res.json())

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
    mutate: mutateUser,
  } = useSWR<UserInfo>(`/api/user/info/${username}`, fetcher)

  const [activeMode, setActiveMode] = useState<
    'followers' | 'followees' | 'mutual_follows'
  >('followers')

  const { isOpen, toggle } = useModal()

  return (
    <>
      {userLoading ? (
        <div>Loading...</div>
      ) : userError ? (
        <div>Error</div>
      ) : (
        <div className={Classes['people']}>
          <div className={Classes['people-info']}>
            <div
              style={{
                height: '200px',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <img
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
                src={import.meta.env.VITE_FURINA_APP_IMG_URL + user?.cover_url}
                alt={user?.username}
              />
            </div>
            <div className={Classes['people-info-avatar']}>
              <img
                src={import.meta.env.VITE_FURINA_APP_IMG_URL + user?.avatar_url}
                alt={user?.username}
              />
              <div className={Classes['people-info-base']}>
                <div className={Classes['username']}>{user?.username}</div>
                <div>{user?.bio}</div>
              </div>
              <div className={Classes['people-info-action']}>
                {' '}
                {username === localStorage.getItem('username') ? (
                  <button
                    onClick={() => {
                      navigate(`/people/edit`)
                    }}
                  >
                    编辑资料
                  </button>
                ) : user?.is_following ? (
                  <button
                    onClick={async () => {
                      await cancelFollow(username)
                      mutateUser()
                    }}
                  >
                    取消关注
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      await follow(username)
                      mutateUser()
                    }}
                  >
                    关注
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={Classes['people-active']}>
            <div className={Classes['people-active-count']}>
              {user?.note_count} 发布 · {user?.be_liked_count} 喜欢 ·{' '}
              {user?.be_collected_count} 收藏
            </div>
            <div className={Classes['people-active-follow']}>
              <div className={Classes['people-active-follow-count']}>
                <span
                  className={Classes['people-active-follow-count-number']}
                  onClick={() => {
                    setActiveMode('followers')
                    toggle()
                  }}
                >
                  {user?.followers.length}
                </span>
                关注 ta 的人
              </div>
              <div className={Classes['people-active-follow-count']}>
                <span
                  className={Classes['people-active-follow-count-number']}
                  onClick={() => {
                    setActiveMode('followees')
                    toggle()
                  }}
                >
                  {user?.followees.length}
                </span>
                ta 关注的人
              </div>
              {user?.mutual_follows && (
                <div className={Classes['people-active-follow-count']}>
                  我关注的人中，有
                  <span
                    className={Classes['people-active-follow-count-number']}
                    onClick={() => {
                      setActiveMode('mutual_follows')
                      toggle()
                    }}
                  >
                    {user?.mutual_follows?.length}
                  </span>
                  人关注了 ta
                </div>
              )}
            </div>

            <Popup
              isOpen={isOpen}
              toggle={toggle}
              children={
                user && <PeopleList peopleList={user[activeMode] || []} />
              }
            />

            {}
          </div>
        </div>
      )}
    </>
  )
}
