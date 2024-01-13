import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getPost } from '@/services'

interface Post {
  _id: string
  title: string
  content: string
}

export const Detail = () => {
  const { id } = useParams()
  const [post, setPost] = useState<Post>()
  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPost(id)
      setPost(res)
    }
    fetchPost()
  }, [id])
  return (
    <div>
      <h1>Detail</h1>
      <h2>{post?.title}</h2>
      <p>{post?.content}</p>
    </div>
  )
}
