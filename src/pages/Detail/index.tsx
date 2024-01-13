import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getPost } from '@/services'
import { addComment } from '@/services'

interface Post {
  _id: string
  title: string
  content: string
  // comments: any[]
  comments: [
    {
      commentId: string
      content: string
      nestedComments: [
        {
          _id: string
          content: string
        },
      ]
    },
  ]
}

export const Detail = () => {
  const { id } = useParams()
  const [post, setPost] = useState<Post>()
  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPost(id as string)
      setPost(res)
    }
    fetchPost()
  }, [id])

  const [comment, setComment] = useState<string>('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value)
  }
  const handleSubmit = async () => {
    await addComment(id as string, comment)
    setComment('')
    const res = await getPost(id as string)
    setPost(res)
  }

  const handleReply = async (mentionee: string) => {
    console.log(mentionee)
    await addComment(id as string, comment, mentionee)
    setComment('')
    const res = await getPost(id as string)
    setPost(res)
  }

  return (
    <div>
      <h1>Detail</h1>
      <h2>{post?.title}</h2>
      <p>{post?.content}</p>
      <h3>Comments</h3>
      <ul>
        {post?.comments.map((comment, i) => (
          <li key={i}>
            {comment.content}

            <button onClick={() => handleReply(comment.commentId)}>回复</button>
            {comment?.nestedComments && <button>展开</button>}
          </li>
        ))}
      </ul>
      <div>
        <input type="text" value={comment} onChange={handleChange} />
        <button onClick={handleSubmit}>Add Comment</button>
      </div>
    </div>
  )
}
