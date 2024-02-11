import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { Feed } from '~/components/Feed'
import { Tabs, useTabs } from '~/components/Tabs'
import {
  Collect,
  Note,
  cancelFollow,
  createCollect,
  follow,
  getCollects,
  getNotes,
  getUserLikes,
} from '~/services'

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

const RelatedNotes = ({ username }: { username: string }) => {
  const { activeTab, setActiveTab } = useTabs('creations')
  const { data, size, setSize, isValidating, isLoading } = useSWRInfinite<
    Note[]
  >(
    (index: number) => ['key-username/note/query/list' + activeTab, index], // 缓存什么的和 key相关
    ([, index]: [string, number]) => {
      return activeTab === 'creations'
        ? getNotes({
            pageCurrent: (index as number) + 1,
            pageSize: PAGE_SIZE,
            username,
          })
        : activeTab === 'likes'
        ? getUserLikes(username, {
            pageCurrent: (index as number) + 1,
            pageSize: PAGE_SIZE,
          })
        : []
    },
  )

  const notes: Note[] = data ? data.flat() : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  const [collects, setCollects] = useState<Collect[]>([])

  useEffect(() => {
    if (activeTab === 'collections') {
      // fetch collections
      getCollects({ username }).then(setCollects)
    }
  }, [activeTab, username])

  const [newCollect, setNewCollect] = useState({
    name: '',
    desc: '',
  })

  const handleCreateCollect = () => {
    if (!newCollect.name) return
    if (!newCollect.desc) return
    createCollect(newCollect).then(() => {
      setNewCollect({
        name: '',
        desc: '',
      })
      getCollects({ username }).then(setCollects)
    })
  }

  return (
    <>
      <Tabs
        tabs={[
          {
            id: 'creations',
            label: '作品',
            content: <div>作品</div>,
          },
          {
            id: 'likes',
            label: '喜欢',
            content: <div>喜欢</div>,
          },
          {
            id: 'collections',
            label: '收藏',
            content: <div>收藏</div>,
          },
        ]}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === activeTab) return
          else {
            setSize(1)
            setActiveTab(tab)
          }
        }}
      />

      {activeTab === 'collections' ? (
        <div>
          collections
          <form>
            {/* 新建用的
            
            ...考虑拆一拆吧...有点长了
            */}
            <input
              type="text"
              value={newCollect.name}
              onChange={(e) =>
                setNewCollect({ ...newCollect, name: e.target.value })
              }
            />
            <input
              type="text"
              value={newCollect.desc}
              onChange={(e) =>
                setNewCollect({ ...newCollect, desc: e.target.value })
              }
            />
            <button type="button" onClick={handleCreateCollect}>
              create
            </button>
          </form>
          <div>
            {collects.map((collect) => (
              <div key={collect._id}>
                <div
                  style={{
                    cursor: 'pointer',
                    fontSize: '1.2em',
                  }}
                >
                  <Link to={`/collect/${collect._id}`}>{collect.name}</Link>
                </div>
                <div
                  style={{
                    color: 'gray',
                    fontSize: '1em',
                  }}
                >
                  {collect.desc}
                </div>
                <div>{collect.notes?.length}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
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
      )}
    </>
  )
}

export const PeopleDetail = () => {
  const { username } = useParams<{ username: string }>()
  return (
    <div>
      <UserInfo username={username as string} />
      <hr />
      <div className={Classes['people-creations']}>
        <RelatedNotes username={username as string} />
      </div>
    </div>
  )
}
