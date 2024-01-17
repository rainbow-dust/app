import { FC, useEffect, useState } from 'react'

import { getNote } from '~/services'

interface Note {
  _id: string
  title: string
  content: string
  pic_urls: string[]
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
      {note?.pic_urls.map((url, i) => (
        <img
          style={{
            maxWidth: '100%',
          }}
          key={i}
          src={url}
          alt="url"
        />
      ))}
    </>
  )
}
