import { FC, useState } from 'react'
import { Link } from 'react-router-dom'

import { cancelLikeNote, likeNote } from '~/services'
import type { Note } from '~/services'

import Avatar from '../Avatar'
import { IconLike } from '../Icons'
import Classes from './NoteCell.module.css'

export const NoteCell: FC<{ content: Note }> = ({ content }) => {
  const [note, setNote] = useState<Note>(content)

  return (
    <div className={Classes['note-cell']}>
      <div className={Classes['note-top']}>
        <Link to={`/explore/${note._id}`} key={note._id}>
          <div>
            <img
              style={{
                width: '100%',
                borderRadius: '10px',
              }}
              src={import.meta.env.VITE_FURINA_APP_IMG_URL + note?.cover?.url}
            ></img>
          </div>
        </Link>
      </div>

      <div className={Classes['note-bottom']}>
        <div
          style={{
            fontSize: '16px',
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
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              imageUrl={
                import.meta.env.VITE_FURINA_APP_IMG_URL +
                note.author?.avatar_url
              }
              altText={note.author?.username}
              size={24}
              peopleLink={`/people/${note.author?.username}`}
            />
            <span style={{ color: 'var(--text-color)', marginLeft: '5px' }}>
              {note.author?.username}
            </span>
          </span>
          <span>
            <IconLike
              isLiked={note?.is_liked}
              handleLike={async () => {
                const data = await likeNote(note._id)
                if (data.ok == 0) return
                setNote({
                  ...data,
                })
              }}
              handleCancelLike={async () => {
                const data = await cancelLikeNote(note._id)
                if (data.ok == 0) return
                setNote({
                  ...data,
                })
              }}
            />
            <span
              style={{
                marginLeft: '5px',
              }}
            >
              {note?.like_count}
            </span>
          </span>
        </span>
      </div>
    </div>
  )
}
