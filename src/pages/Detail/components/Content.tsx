import { FC } from 'react'
import useSWR from 'swr'

import { getNote } from '~/services'
import type { Pic } from '~/services'

interface Note {
  _id: string
  title: string
  content: string
  pic_list: Pic[]
}

export const Content: FC<{ noteId: string }> = ({ noteId }) => {
  const { data: note } = useSWR<Note>(['key-/note/query/detail', noteId], () =>
    getNote(noteId),
  )

  return (
    <>
      <h2>{note?.title}</h2>
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
    </>
  )
}
