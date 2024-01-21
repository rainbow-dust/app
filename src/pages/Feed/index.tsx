import React, { useEffect, useState } from 'react'
import { BsHeart } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import { getNotes } from '~/services'

interface Note {
  _id: string
  title: string
  content: string
  user: {
    _id: string
    username: string
  }
  tags: string[]
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
            <p style={{ color: '#999' }}>{content.user?.username}</p>

            <div>{content.content}</div>
            {content?.tags?.map((tag) => (
              <span key={tag}>#{tag} </span>
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