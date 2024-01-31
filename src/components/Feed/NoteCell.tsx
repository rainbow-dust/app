import { FC, useState } from 'react'
import { Link } from 'react-router-dom'

import { cancelLikeNote, likeNote } from '~/services'

import type { Note } from './index'

export const NoteCell: FC<{ content: Note }> = ({ content }) => {
  const [note, setNote] = useState<Note>(content)

  return (
    <li key={note._id}>
      <div>
        <Link to={`/detail/${note._id}`} key={note._id}>
          <h3>{note.title}</h3>
        </Link>
        <div>{note.content}</div>
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
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          <Link to={`/people/${note?.author?.username} `}>
            <img
              style={{
                width: '24px',
                height: '24px',
              }}
              src={'http://192.168.2.153:9527' + note.author?.avatar_url}
            ></img>
            <span style={{ color: '#999' }}>{note.author?.username}</span>
          </Link>
        </span>
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
      </div>
      <hr />
    </li>
  )
}
