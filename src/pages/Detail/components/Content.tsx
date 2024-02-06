import { FC } from 'react'
import useSWR from 'swr'

import { getNote } from '~/services'
import type { Pic } from '~/services'

import { ContentAuthor } from './ContentAuthor'
import { ContentNote } from './ContentNote'
import { ContentPics } from './ContentPics'

interface Note {
  _id: string
  title: string
  content: string
  author: {
    username: string
    avatar_url: string
  }
  pic_list: Pic[]
  tags: {
    _id: string
    name: string
  }[]
}

export const Content: FC<{ noteId: string }> = ({ noteId }) => {
  const { data: note } = useSWR<Note>(['key-/note/query/detail', noteId], () =>
    getNote(noteId),
  )

  return (
    <>
      {/* 这里这样可以通过监听窗口大小，给出不同的组件布局...好像css就可以做到哦...不过虽然没啥大用也不至于不能用就是了 */}
      <ContentAuthor author={note?.author} />
      <ContentPics pic_list={note?.pic_list} />
      <ContentNote
        title={note?.title}
        content={note?.content}
        tags={note?.tags}
      />
    </>
  )
}
