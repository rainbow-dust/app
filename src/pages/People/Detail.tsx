import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { Feed } from '~/components/Feed'
import { getNotes } from '~/services'

import Classes from './Detail.module.css'

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

  const { data, error, isLoading } = useSWR<UserInfo>(
    `/api/user/${username}`,
    fetcher,
  )

  const swrOp = {
    key: (index: number) => ['key-/note/query/list', index],
    fetcher: ([, index]: [string, number]) =>
      getNotes({
        pageCurrent: (index as number) + 1,
        pageSize: 10,
        username,
      }),
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  return (
    <div>
      <h1>Info</h1>
      <div className={Classes['people-info']}>
        <div className={Classes['people-avatar']}>
          <img
            src={'http://192.168.2.153:9527' + data?.avatar_url}
            alt={data?.username}
          />
        </div>
        <div>{data?.username}</div>
        <div>{data?.bio}</div>
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
      <div className={Classes['people-creations']}>
        <h2>Creations</h2>
        <Feed swrOp={swrOp} />
      </div>
    </div>
  )
}
