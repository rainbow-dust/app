import { FC, useState } from 'react'
import { Link } from 'react-router-dom'

import { cancelLikeNote, likeNote } from '~/services'
import type { Note } from '~/services'

export const NoteCell: FC<{ content: Note }> = ({ content }) => {
  const [note, setNote] = useState<Note>(content)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '10px',
        border: '1px solid rgb(70 148 223)',
        borderRadius: '4px',
        marginBottom: '10px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div>
        <Link to={`/explore/${note._id}`} key={note._id}>
          {/* <div>{note.content}</div> */}
          <div>
            <img
              style={{
                width: '100%',
              }}
              src={'http://192.168.2.153:9527' + note?.cover?.url}
            ></img>
          </div>
        </Link>

        {/* {note?.tags?.map((tag) => (
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
        ))} */}
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
          <Link
            to={`/people/${note?.author?.username} `}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#999',
            }}
          >
            <img
              style={{
                width: '20px',
                height: '20px',
              }}
              src={'http://192.168.2.153:9527' + note.author?.avatar_url}
            ></img>
            <span style={{ color: '#999' }}>{note.author?.username}</span>
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
