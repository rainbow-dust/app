import { Link } from 'react-router-dom'
import useSWR from 'swr'

import { getNoticeList } from '~/services'

import Classes from './index.module.css'

interface Notice {
  _id: string
  type: NoticeType
  topic: string // id
  description: string
  is_read: boolean
  from: {
    _id: string
    username: string
  }
  to: string // id
  created: string
}

enum NoticeType {
  like = 'like',
  comment = 'comment',
  follow = 'follow',
  system = 'system',
}

// type to icon
const noticeTypeToIcon = {
  like: '💖',
  comment: '💬',
  follow: '👤',
  system: '📢',
}

export const Notice = () => {
  const { data, error, isLoading } = useSWR(`/api/notice/list`, getNoticeList)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  return (
    <div>
      <h1>Notice</h1>
      <div className={Classes['notice-list']}>
        {data?.map((item: Notice) => (
          <div key={item._id} className={Classes['notice-item']}>
            <span>
              {noticeTypeToIcon[item.type as keyof typeof NoticeType]}
            </span>

            <Link to={`/people/${item.from.username}`}>
              {item.from.username}
            </Link>
            <span> 在 {item.created} </span>
            <span>{item.description} </span>
            <Link to={`/detail/${item.topic}`}>{item.topic}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
