// 直接自动请求了数据吧...当前用户和当前文章，性能什么的之后再说?

import { useState } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'

import { Message } from '~/components/Message'
import {
  Collect,
  addNoteToCollect,
  createCollect,
  getCollects,
  removeNoteFromCollect,
} from '~/services'

import Classes from './CollectList.module.css'

interface CollectListProps {
  noteId: string | undefined
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
    if (!noteId) return
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
    if (!noteId) return
    removeNoteFromCollect({ noteId, collectId })
      .then(() => {
        Message.success('取消收藏成功')
        mutate()
      })
      .catch((err) => {
        Message.error(err)
      })
  }
  const [isAddNew, setIsAddNew] = useState(false)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h3>{localStorage.getItem('username') + '的收藏夹'}</h3>
      <div className={Classes['collect-list']}>
        {collects?.map((collect: Collect) => (
          <div key={collect._id} className={Classes['collect-item']}>
            <div>
              <Link to={`/collect/${collect._id}`}>{collect.name}</Link>
              <div
                style={{
                  color: 'var(--text-color-secondary)',
                  fontSize: '14px',
                }}
              >
                {collect.desc}
              </div>
            </div>

            {noteId ? (
              collect.is_collected ? (
                <button onClick={() => handleCancelCollect(collect._id)}>
                  取消收藏
                </button>
              ) : (
                <button onClick={() => handleCollect(collect._id)}>收藏</button>
              )
            ) : (
              ''
            )}
          </div>
        ))}
        {isAddNew ? (
          <AddCollect mutate={mutate} setIsAddNew={setIsAddNew} />
        ) : (
          <button onClick={() => setIsAddNew(true)}>新建收藏夹</button>
        )}
      </div>
    </>
  )
}

const AddCollect: React.FC<
  { mutate: () => void } & { setIsAddNew: (isAddNew: boolean) => void }
> = ({ mutate, setIsAddNew }) => {
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
      mutate()
    })
  }
  return (
    <div>
      <h3>新建收藏夹</h3>
      <div>
        <input
          type="text"
          placeholder="收藏夹名字"
          value={newCollect.name}
          onChange={(e) => {
            setNewCollect({
              ...newCollect,
              name: e.target.value,
            })
          }}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="收藏夹描述"
          value={newCollect.desc}
          onChange={(e) => {
            setNewCollect({
              ...newCollect,
              desc: e.target.value,
            })
          }}
        />
      </div>
      <div>
        <button onClick={handleCreateCollect}>创建</button>
        <button onClick={() => setIsAddNew(false)}>取消</button>
      </div>
    </div>
  )
}
