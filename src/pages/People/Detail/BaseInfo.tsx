import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

import Avatar from '~/components/Avatar'
import { cancelFollow, follow } from '~/services'

import Classes from './Detail.module.css'

interface UserInfo {
  username: string
  avatar_url: string
  password: string
  bio: string
  followees: UserInfo[]
  followers: UserInfo[]
  is_following: boolean
  mutual_follows?: UserInfo[]
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

  return (
    <div>
      {userLoading ? (
        <div>Loading...</div>
      ) : userError ? (
        <div>Error</div>
      ) : (
        <div className="info">
          <div className={Classes['people-info']}>
            <div
              style={{
                background: `url(https://huamurui.github.io/biubiubiu.jpg) no-repeat center center`,
                // 我希望背景图片只占一半总高度，宽度拉伸缩小，高度裁剪
                backgroundSize: `cover`,
                backgroundPosition: `center`,
                height: `250px`,
                width: `100%`,
              }}
            ></div>

            <div
              className={Classes['people-avatar']}
              style={{
                position: 'relative',
                width: '100%',
                height: '80px',
              }}
            >
              <img
                src={import.meta.env.VITE_FURINA_APP_IMG_URL + user?.avatar_url}
                alt={user?.username}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '2px solid var(--border-color)',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: '-25px',
                  left: '10%',
                }}
              />
              <div
                style={{
                  marginLeft: 'calc(10% + 120px)',
                  marginTop: '10px',
                }}
              >
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  {user?.username}
                </div>
                <div>{user?.bio}</div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: '10%',
                  top: '15px',
                }}
              >
                {' '}
                {username === localStorage.getItem('username') ? (
                  <button
                    onClick={() => {
                      navigate(`/people/edit`)
                    }}
                  >
                    go to edit
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
          <div>❤ 0 喜欢 · 0 收藏</div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: '20px',
              fontSize: '14px',
            }}
          >
            <div
              style={{
                paddingRight: '20px',
                borderRight: '1px solid var(--border-color)',
              }}
            >
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveMode('followers')}
              >
                {user?.followers.length}
              </span>{' '}
              关注 ta 的人
            </div>
            <div
              style={{
                paddingRight: '20px',
                borderRight: '1px solid var(--border-color)',
              }}
            >
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveMode('followees')}
              >
                {user?.followees.length}
              </span>
              ta 关注的人
            </div>
            {user?.mutual_follows && (
              <div>
                我关注的人中，有
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveMode('mutual_follows')}
                >
                  {user?.mutual_follows?.length}
                </span>{' '}
                人关注了 ta
              </div>
            )}
          </div>
          {user && <PeopleList peopleList={user[activeMode] || []} />}
        </div>
      )}
    </div>
  )
}

const PeopleList = ({ peopleList }: { peopleList: UserInfo[] }) => {
  return (
    <div>
      {peopleList.map((people) => (
        <span key={people.username}>
          <Avatar
            imageUrl={
              import.meta.env.VITE_FURINA_APP_IMG_URL + people.avatar_url
            }
            altText={people.username}
            size={16}
            peopleLink={`/people/${people.username}`}
          />
          {people.username}
        </span>
      ))}
    </div>
  )
}
