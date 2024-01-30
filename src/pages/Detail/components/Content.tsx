import { FC } from 'react'
import useSWR from 'swr'

import { getNote } from '~/services'
import type { Pic } from '~/services'

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
      <h2>{note?.title}</h2>
      <span>
        <img
          style={{
            width: '24px',
            height: '24px',
          }}
          src={note?.author?.avatar_url}
        ></img>
        <span style={{ color: '#999' }}>{note?.author.username}</span>
      </span>
      <p>{note?.content}</p>
      {note?.pic_list?.map((pic, i) => (
        <img
          style={{
            maxWidth: '100%',
          }}
          key={i}
          src={'http://192.168.2.153:9527' + pic.url}
          alt="url"
        />
      ))}
      {note?.tags?.map((tag) => (
        <span
          key={tag._id}
          style={{
            color: '#999',
            marginRight: '10px',
            border: '1px solid #999',
            borderRadius: '4px',
            padding: '0px 2px',
            fontSize: '14px',
          }}
        >
          {tag?.name}{' '}
        </span>
      ))}
    </>
  )
}
