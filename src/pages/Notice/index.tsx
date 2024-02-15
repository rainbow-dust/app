import { Link } from 'react-router-dom'
import useSWRInfinite from 'swr/infinite'

import Avatar from '~/components/Avatar'
import { LazyLoading } from '~/components/Feed/LazyLoading'
import { getDate } from '~/hooks/useDate'
import { getNoticeList } from '~/services'

import Classes from './index.module.css'

const PAGE_SIZE = 10

interface Notice {
  _id: string
  type: NoticeType
  topic: string // id
  description: string
  is_read: boolean
  from: {
    _id: string
    username: string
    avatar_url: string
  }
  to: string // id
  created: string
}

enum NoticeType {
  like = 'like',
  comment = 'comment',
  follow = 'follow',
  system = 'system',
  collect = 'collect',
}

// type to icon
const noticeTypeToIcon = {
  like: '❤',
  comment: '💬',
  follow: '👤',
  system: '📢',
  collect: '⭐️',
}

export const Notice = () => {
  // const { data, error, isLoading } = useSWR(`/api/notice/list`, getNoticeList)
  const { data, size, setSize, isValidating, isLoading, error } =
    useSWRInfinite(
      (index: number) => ['api/notice/list', index],
      ([, index]: [string, number]) =>
        getNoticeList({
          pageCurrent: (index as number) + 1,
          pageSize: PAGE_SIZE,
        }),
    )

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  const notices = data?.reduce((acc, page) => acc.concat(page), [])

  if (error) return <div>Error</div>
  if (isLoading) return <div>Loading...</div>
  return (
    <div>
      <h1>Notice</h1>
      <div className={Classes['notice-list']}>
        {notices?.map((item: Notice) => (
          <div key={item._id} className={Classes['notice-item']}>
            <span>
              {noticeTypeToIcon[item.type as keyof typeof NoticeType]}
            </span>

            <Link to={`/people/${item.from.username}`}>
              <Avatar
                imageUrl={
                  import.meta.env.VITE_FURINA_APP_IMG_URL + item.from.avatar_url
                }
                altText={item.from.username}
                size={18}
                peopleLink={`/people/${item.from.username}`}
              />
              {item.from.username}
            </Link>
            <span> 在 {getDate(item.created)} </span>
            <span>{item.description} </span>
            <Link to={`/detail/${item.topic}`}>{item.topic}</Link>
          </div>
        ))}
        <LazyLoading
          isLoadingMore={isLoadingMore || isRefreshing}
          isReachingEnd={isReachingEnd}
          setSize={setSize}
          size={size}
        />
      </div>
    </div>
  )
}
