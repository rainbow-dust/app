import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getPost } from '~/services'
import { addComment } from '~/services'

interface Post {
  _id: string
  title: string
  content: string
  // comments: any[]
  pic_urls: string[]
  comments: [
    {
      comment_id: string
      content: string
      nested_comments: [
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
    await addComment(id as string, comment, undefined, undefined)
    setComment('')
    const res = await getPost(id as string)
    setPost(res)
  }

  const handleReply = async (mentionee: string) => {
    await addComment(id as string, comment, mentionee, mentionee)
    setComment('')
    const res = await getPost(id as string)
    setPost(res)
  }

  return (
    <div>
      <h1>Detail</h1>
      <h2>{post?.title}</h2>
      <p>{post?.content}</p>
      {post?.pic_urls.map((url, i) => (
        <img
          style={{
            maxWidth: '100%',
          }}
          key={i}
          src={url}
          alt="url"
        />
      ))}
      <h3>Comments</h3>
      <ul>
        {post?.comments.map((comment, i) => (
          <li key={i}>
            {comment.content}

            <button onClick={() => handleReply(comment.comment_id)}>
              回复
            </button>
            {comment?.nested_comments && <button>展开</button>}
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
