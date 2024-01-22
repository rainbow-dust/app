import React, { useEffect, useState } from 'react'
import { BsHeart } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import { cancelLikeNote, getNotes, likeNote } from '~/services'

interface Note {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    username: string
    avatar_url: string
  }
  tags: {
    _id: string
    name: string
  }[]
  likes_count: number
  is_liked: boolean
}

const ContentListQueryPage: React.FC = () => {
  const [contentList, setContentList] = useState<Note[]>([])

  useEffect(() => {
    // Fetch content list data from API or database
    const fetchContentList = async () => {
      const res = await getNotes()
      setContentList(res.noteList)
    }

    fetchContentList()
  }, [])

  return (
    <div>
      <h1>Content List</h1>
      <div
        style={{
          position: 'relative',
          width: '16px',
          height: '16px',
        }}
      >
        <BsHeart />
        <span
          style={{
            position: 'absolute',
            top: '-3px',
            right: '-1px',
            fontSize: '8px',
            width: '8px',
            height: '8px',
            color: 'red',
            backgroundColor: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          1222
        </span>
      </div>
      <ul>
        {contentList.map((content) => (
          <li key={content._id}>
            <Link to={`/detail/${content._id}`} key={content._id}>
              <h6>{content.title}</h6>
            </Link>
            <div>{content.content}</div>

            <div>
              <Link to={`/people/${content?.author?.username} `}>
                <img
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                  src={content.author?.avatar_url}
                ></img>
                <span style={{ color: '#999' }}>
                  {content.author?.username}
                </span>
              </Link>
            </div>
            {content?.is_liked ? (
              <button
                onClick={async () => {
                  await cancelLikeNote(content._id)
                }}
              >
                {content?.likes_count}
                取消点赞
              </button>
            ) : (
              <button
                onClick={async () => {
                  await likeNote(content._id)
                }}
              >
                {content?.likes_count}
                点赞
              </button>
            )}
            {content?.tags?.map((tag) => (
              <span key={tag._id}>#{tag?.name} </span>
            ))}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  )
}

export const Feed = () => {
  return (
    <div>
      <h1>Feed</h1>
      <ContentListQueryPage />
    </div>
  )
}
