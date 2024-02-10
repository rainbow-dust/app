import React, { FC, useState } from 'react'
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
          <Avatar
            imageUrl={
              import.meta.env.VITE_FURINA_APP_IMG_URL + note.author?.avatar_url
            }
            altText={note.author?.username}
            size={24}
            peopleLink={`/people/${note.author?.username}`}
          />
          <span style={{ color: 'var(--text-color)' }}>
            {note.author?.username}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
            }}
          >
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
            {note?.like_count}
          </span>
        </span>
      </div>
    </div>
  )
}
