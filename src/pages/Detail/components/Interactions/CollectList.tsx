// 直接自动请求了数据吧...当前用户和当前文章，性能什么的之后再说?

import { Link } from 'react-router-dom'
import useSWR from 'swr'

import { Message } from '~/components/Message'
import {
  addNoteToCollect,
  getCollects,
  removeNoteFromCollect,
} from '~/services'

import Classes from './CollectList.module.css'

interface CollectItem {
  _id: string
  name: string
  desc: string
  is_collected: boolean
}

interface CollectListProps {
  noteId: string
}

export const CollectList: React.FC<CollectListProps> = (props) => {
  const { noteId } = props

  const {
    data: collects,
    isLoading: loading,
    mutate,
  } = useSWR('/collects', () => {
    return getCollects({
      noteId,
      username: localStorage.getItem('username') || '',
    })
  })

  const handleCollect = (collectId: string) => {
    addNoteToCollect({ noteId, collectId })
      .then(() => {
        Message.success('收藏成功')
        mutate()
      })
      .catch((err) => {
        Message.error(err)
      })
  }
  const handleCancelCollect = (collectId: string) => {
    removeNoteFromCollect({ noteId, collectId })
      .then(() => {
        Message.success('取消收藏成功')
        mutate()
      })
      .catch((err) => {
        Message.error(err)
      })
  }

  return (
    <div className={Classes['collect-list']}>
      {loading}
      {collects?.map((collect: CollectItem) => (
        <div key={collect._id} className={Classes['collect-item']}>
          <Link to={`/collect/${collect._id}`}>{collect.name}</Link>
          {collect.is_collected ? (
            <button onClick={() => handleCancelCollect(collect._id)}>
              取消收藏
            </button>
          ) : (
            <button onClick={() => handleCollect(collect._id)}>收藏</button>
          )}
        </div>
      ))}
    </div>
  )
}
