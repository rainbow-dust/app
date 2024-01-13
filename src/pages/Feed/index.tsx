import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getPosts } from '@/services'

interface Post {
  _id: string
  title: string
  content: string
}

const ContentListQueryPage: React.FC = () => {
  const [contentList, setContentList] = useState<Post[]>([])

  useEffect(() => {
    // Fetch content list data from API or database
    const fetchContentList = async () => {
      const res = await getPosts()
      setContentList(res.postList)
    }

    fetchContentList()
  }, [])

  return (
    <div>
      <h1>Content List</h1>
      <ul>
        {contentList.map((content) => (
          <li key={content._id}>
            <Link to={`/detail/${content._id}`} key={content._id}>
              <h6>{content.title}</h6>
            </Link>
            <p>{content.content}</p>
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
