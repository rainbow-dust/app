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

  return (
    <div>
      {userLoading ? (
        <div>Loading...</div>
      ) : userError ? (
        <div>Error</div>
      ) : (
        <div className="info">
          <h1>Info</h1>
          <div className={Classes['people-info']}>
            <div className={Classes['people-avatar']}>
              <img
                src={import.meta.env.VITE_FURINA_APP_IMG_URL + user?.avatar_url}
                alt={user?.username}
              />
            </div>
            <div>{user?.username}</div>
            <div>{user?.bio}</div>
          </div>
          <div>
            <p>
              followers: {user?.followers.length},{' '}
              {user?.followers.map((user) => user.username).join(', ')}
            </p>
            <p>
              followees: {user?.followees.length},{' '}
              {user?.followees.map((user) => user.username).join(', ')}
            </p>
            {user?.mutual_follows && (
              <p>
                我关注的人中，有{user?.mutual_follows?.length} 人关注了 ta,
                分别是:{' '}
                {user?.mutual_follows?.map((user) => {
                  return (
                    <>
                      <Avatar
                        imageUrl={
                          import.meta.env.VITE_FURINA_APP_IMG_URL +
                          user?.avatar_url
                        }
                        altText={user?.username || 'avatar'}
                        size={16}
                        peopleLink={`/people/${user?.username}`}
                      />
                      {user.username + ''}
                    </>
                  )
                })}
              </p>
            )}
          </div>
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
      )}
    </div>
  )
}
