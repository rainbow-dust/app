import { FC, useState } from 'react'
import { Link } from 'react-router-dom'

import { cancelLikeNote, likeNote } from '~/services'
import type { Note } from '~/services'

import Classes from './NoteCell.module.css'

export const NoteCell: FC<{ content: Note }> = ({ content }) => {
  const [note, setNote] = useState<Note>(content)

  return (
    <div className={Classes['note-cell']}>
      <div>
        <Link to={`/explore/${note._id}`} key={note._id}>
          {/* <div>{note.content}</div> */}
          <div>
            <img
              style={{
                width: '100%',
              }}
              src={import.meta.env.VITE_FURINA_APP_IMG_URL + note?.cover?.url}
            ></img>
          </div>
        </Link>
      </div>

      <div
        style={{
          padding: '10px 0',
        }}
      >
        <div
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px',
          }}
        >
          {note.title}
        </div>

        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
          }}
        >
          {/* 
            avatar 可以考虑做一个组件了...
            甚至 like icon 也可以
          */}
          <Link
            to={`/people/${note?.author?.username} `}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'var(--text-color-secondary)',
            }}
          >
            <img
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                marginRight: '10px',
              }}
              src={
                import.meta.env.VITE_FURINA_APP_IMG_URL +
                note.author?.avatar_url
              }
            ></img>
            <span style={{ color: 'var(--text-color)' }}>
              {note.author?.username}
            </span>
          </Link>
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
        </span>
      </div>
    </div>
  )
}
