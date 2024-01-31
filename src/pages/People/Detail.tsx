import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { Feed } from '~/components/Feed'
import { Note, getNotes } from '~/services'

import Classes from './Detail.module.css'

const PAGE_SIZE = 10

interface UserInfo {
  username: string
  avatar_url: string
  password: string
  bio: string
}

export const PeopleDetail = () => {
  const { username } = useParams<{ username: string }>()
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
  } = useSWR<UserInfo>(`/api/user/${username}`, fetcher)

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

  const notes: Note[] = data ? data.flat() : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

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
          {username === localStorage.getItem('username') && (
            <button
              onClick={() => {
                navigate(`/people/edit`)
              }}
            >
              go to edit
            </button>
          )}
        </div>
      )}{' '}
      <div className={Classes['people-creations']}>
        <h2>Creations</h2>
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
        {/* 这个...多个页面使用会有bug...我就说，应该把 feed 拆更细一点，然后把 swr 的整个控制都放在外部，就是放到 pages 这边组件里，传值到小组件里就好... */}
      </div>
    </div>
  )
}
