import { FC, useEffect, useState } from 'react'

import { getPost } from '~/services'

interface Post {
  _id: string
  title: string
  content: string
  pic_urls: string[]
}

export const Content: FC<{ postId: string }> = ({ postId }) => {
  const [post, setPost] = useState<Post>()
  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPost(postId)
      setPost(res)
    }
    fetchPost()
  }, [postId])

  return (
    <>
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
    </>
  )
}
