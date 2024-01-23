import { FC, useEffect, useState } from 'react'

import { Pic, getNote } from '~/services'

interface Note {
  _id: string
  title: string
  content: string
  pic_list: Pic[]
}

export const Content: FC<{ noteId: string }> = ({ noteId }) => {
  const [note, setNote] = useState<Note>()
  useEffect(() => {
    const fetchNote = async () => {
      const res = await getNote(noteId)
      setNote(res)
    }
    fetchNote()
  }, [noteId])

  return (
    <>
      <h2>{note?.title}</h2>
      <p>{note?.content}</p>
      {note?.pic_list.map((pic, i) => (
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
