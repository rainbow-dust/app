import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { Feed } from '~/components/Feed'
import { Note, cancelFollow, follow, getNotes, getUserLikes } from '~/services'

import Classes from './Detail.module.css'

const PAGE_SIZE = 10

interface UserInfo {
  username: string
  avatar_url: string
  password: string
  bio: string
  followees: UserInfo[]
  followers: UserInfo[]
  is_following: boolean
}

const UserInfo = ({ username }: { username: string }) => {
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
                src={'http://192.168.2.153:9527' + user?.avatar_url}
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
                const res = await cancelFollow(username)
                console.log('res', res)
                mutateUser()
              }}
            >
              取消关注
            </button>
          ) : (
            <button
              onClick={async () => {
                const res = await follow(username)
                console.log('res', res)
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

const RelatedNotes = ({ username }: { username: string }) => {
  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite<Note[]>(
      (index: number) => ['key-username/note/query/list', index], // 缓存什么的和 key相关
      ([, index]: [string, number]) =>
        getNotes({
          pageCurrent: (index as number) + 1,
          pageSize: PAGE_SIZE,
          username,
        }),
    )

  console.log('data', data, mutate)

  // 应该给一个 tab 选择是看喜欢 or 作品，然后下面的 feed 组件倒可以用一个。嗯....甚至可以更激进一点，swr 也可以，只是需要换个 fetch 函数？...不不不，缓存可能会乱...emmm 那就连 key 一起换就好
  getUserLikes(username as string).then((res) => {
    console.log('res', res)
  })

  const notes: Note[] = data ? data.flat() : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  return (
    <Feed
      notes={notes}
      options={{
        isEmpty,
        isReachingEnd,
        isRefreshing,
        isLoadingMore,
        setSize,
        size,
      }}
    />
  )
}

export const PeopleDetail = () => {
  const { username } = useParams<{ username: string }>()
  return (
    <div>
      <UserInfo username={username as string} />
      <div className={Classes['people-creations']}>
        <h2>Creations</h2>
        <RelatedNotes username={username as string} />
      </div>
    </div>
  )
}
