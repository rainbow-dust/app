import { FC, useState } from 'react'
import { Link } from 'react-router-dom'

import { cancelLikeNote, likeNote } from '~/services'

import type { Note } from './index'

export const NoteCell: FC<{ content: Note }> = ({ content }) => {
  const [note, setNote] = useState<Note>(content)

  return (
    <li key={note._id}>
      <Link to={`/detail/${note._id}`} key={note._id}>
        <h6>{note.title}</h6>
      </Link>
      <div>{note.content}</div>

      <div>
        <Link to={`/people/${note?.author?.username} `}>
          <img
            style={{
              width: '24px',
              height: '24px',
            }}
            src={note.author?.avatar_url}
          ></img>
          <span style={{ color: '#999' }}>{note.author?.username}</span>
        </Link>
      </div>
      {note?.is_liked ? (
        <button
          onClick={async () => {
            const data = await cancelLikeNote(note._id)
            if (data.ok == 0) return
            setNote({
              ...data,
            })
          }}
        >
          {note?.like_count}
          取消点赞
        </button>
      ) : (
        <button
          onClick={async () => {
            const data = await likeNote(note._id)
            if (data.ok == 0) return
            setNote({
              ...data,
            })
          }}
        >
          {note?.like_count}
          点赞
        </button>
      )}
      {note?.tags?.map((tag) => (
        <span key={tag._id}>#{tag?.name} </span>
      ))}
      <hr />
    </li>
  )
}
