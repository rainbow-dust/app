import { FC, useEffect, useState } from 'react'

import {
  addComment,
  cancelLikeComment,
  getChildComments,
  getRootComments,
  likeComment,
} from '~/services'

interface Comment {
  _id: string
  content: string
  likes: number
  is_liked?: boolean
  author_id: {
    _id: string
    username: string
  }
  created_at: string
}

interface RootComment extends Comment {
  children?: Comment[]
  child_comment_count?: number
}

export const Comments: FC<{ postId: string }> = ({ postId }) => {
  const [rootComments, setRootComments] = useState<RootComment[]>([])
  const fetchRootComments = async (postId: string) => {
    const res = await getRootComments(postId)
    setRootComments(res.data)
  }

  useEffect(() => {
    fetchRootComments(postId)
  }, [postId])

  const unfoldReply = async (commentId: string) => {
    const res = await getChildComments(commentId)
    const newRootComments = rootComments.map((comment) => {
      if (comment._id === commentId) {
        return {
          ...comment,
          children: res.data,
        }
      }
      return comment
    })
    setRootComments(newRootComments)
  }

  const [content, setContent] = useState('')
  const handleReply = async (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => {
    const res = await addComment(postId, content, rootCommentId, meetioneeId)
    if (rootCommentId) {
      fetchRootComments(postId)
    } else {
      unfoldReply(res._id)
    }
  }

  return (
    <>
      <ul>
        {rootComments?.map((comment) => (
          <li>
            <p>{comment.content}</p>
            <p>{comment.author_id.username}</p>
            <p>{comment.created_at}</p>
            <p>{comment.likes}</p>
            {comment.is_liked ? (
              <button onClick={() => cancelLikeComment(comment._id)}>
                取消点赞
              </button>
            ) : (
              <button onClick={() => likeComment(comment._id)}>点赞</button>
            )}
            <button onClick={() => handleReply(comment.content, comment._id)}>
              回复
            </button>

            {comment.child_comment_count && comment.child_comment_count > 0 && (
              <button onClick={() => unfoldReply(comment._id)}>
                展开{comment.child_comment_count}条回复
              </button>
            )}
            <ul>
              {comment.children &&
                comment.children.map((child) => (
                  <li>
                    <p>{child.content}</p>
                    <p>{child.author_id.username}</p>
                    <p>{child.created_at}</p>
                    <p>{child.likes}</p>
                    {child.is_liked ? (
                      <button onClick={() => cancelLikeComment(child._id)}>
                        取消点赞
                      </button>
                    ) : (
                      <button onClick={() => likeComment(child._id)}>
                        点赞
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleReply(
                          child.content,
                          comment._id,
                          child.author_id._id,
                        )
                      }
                    >
                      回复
                    </button>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
      <div>
        <label htmlFor="reply">回复</label>
        <input
          type="text"
          placeholder="评论"
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={() => handleReply(content)}>评论</button>
      </div>
    </>
  )
}
