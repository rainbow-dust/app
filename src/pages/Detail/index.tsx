import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { addComment, getComments, getPost } from '~/services'

interface Post {
  _id: string
  title: string
  content: string
  // comments: any[]
  pic_urls: string[]
  comments: RootComment[]
}

interface RootComment {
  comment_id: string
  content: string
  child_comment_count: number
  child_comments: child_comment[]
}

interface child_comment {
  _id: string
  content: string
}

export const Detail = () => {
  const { id } = useParams()
  const [post, setPost] = useState<Post>()
  const [comments, setComments] = useState<RootComment[]>([])
  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPost(id as string)
      setPost(res)
      setComments(res.comments)
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
    // 这时的评论应该只增不减
    setComments([...comments, res.comments])
  }

  const getChildren = async (comment_id: string) => {
    const res = await getComments(comment_id)
    // 将数据塞到对应的comment里面，根据id来

    const newComments = comments.map((comment) => {
      if (comment.comment_id === comment_id) {
        comment.child_comments = res.data
      }
      return comment
    })
    setComments(newComments)
    console.log(newComments)
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
        {comments.map((comment, i) => (
          <li key={i}>
            {comment.content}
            {comment?.child_comment_count}
            <button onClick={() => handleReply(comment.comment_id)}>
              回复
            </button>
            {comment?.child_comment_count > 0 && (
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => getChildren(comment.comment_id)}
              >
                展开{comment.child_comment_count}条评论
              </span>
            )}
            {
              <ul>
                {comment?.child_comments?.map(
                  (child_comment: child_comment, i: number) => (
                    <li key={i}>{child_comment.content}</li>
                  ),
                )}
              </ul>
            }
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
