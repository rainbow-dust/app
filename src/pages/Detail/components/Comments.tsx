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
  author: {
    _id: string
    username: string
  }
  created_at: string
}

// interface CommentCreateDto {
//   note_id: string
//   content: string
//   root_comment_id?: string
//   meetionee_id?: string
// }

interface RootComment extends Comment {
  children?: Comment[]
  child_comment_count?: number
}

const Comment: FC<{
  comment: RootComment
  handleReply: (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => void
  unfoldReply: (commentId: string) => void
  likeComment: (commentId: string) => void
  cancelLikeComment: (commentId: string) => void
}> = ({
  comment,
  handleReply,
  unfoldReply,
  likeComment,
  cancelLikeComment,
}) => {
  return (
    <li>
      <p>{comment.content}</p>
      <p>{comment.author?.username}</p>
      <p>{comment.created_at}</p>
      <p>{comment.likes}</p>
      {comment.is_liked ? (
        <button onClick={() => cancelLikeComment(comment._id)}>取消点赞</button>
      ) : (
        <button onClick={() => likeComment(comment._id)}>点赞</button>
      )}
      <button
        onClick={() =>
          handleReply(comment.content, comment._id, comment.author._id)
        }
      >
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
            <li key={child._id}>
              <p>{child.content}</p>
              <p>{child.author.username}</p>
              <p>{child.created_at}</p>
              <p>{child.likes}</p>
              {child.is_liked ? (
                <button onClick={() => cancelLikeComment(child._id)}>
                  取消点赞
                </button>
              ) : (
                <button onClick={() => likeComment(child._id)}>点赞</button>
              )}
              <button
                onClick={() =>
                  handleReply(child.content, comment._id, child.author._id)
                }
              >
                回复
              </button>
            </li>
          ))}
      </ul>
    </li>
  )
}

const Replier: FC<{
  isReplierActive: boolean
  replyRootCommentId?: string
  replyMeetioneeId?: string
  handleAddComment: (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => void
}> = ({
  isReplierActive,
  replyRootCommentId,
  replyMeetioneeId,
  handleAddComment,
}) => {
  const [content, setContent] = useState('')
  return (
    <div
      style={{
        position: 'fixed',
        bottom: isReplierActive ? '200px' : '80px',
        left: '0',
        width: '100%',
        backgroundColor: '#fff',
      }}
    >
      <label htmlFor="reply">
        回复
        {replyMeetioneeId && <span>@{replyMeetioneeId}</span>}
      </label>
      <input
        type="text"
        placeholder="评论"
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={() =>
          handleAddComment(content, replyRootCommentId, replyMeetioneeId)
        }
      >
        评论
      </button>
    </div>
  )
}

export const Comments: FC<{ noteId: string }> = ({ noteId }) => {
  const [rootComments, setRootComments] = useState<RootComment[]>([])
  const fetchRootComments = async (noteId: string) => {
    const res = await getRootComments(noteId)
    setRootComments(res.data)
  }

  useEffect(() => {
    fetchRootComments(noteId)
  }, [noteId])

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

  // 应该有变量，去控制 Replier 的唤起和不唤起，以及唤起的时候，传递给 Replier 的参数
  const [isReplierActive, setIsReplierActive] = useState(false)
  const [replyRootCommentId, setReplyRootCommentId] = useState<string>()
  const [replyMeetioneeId, setReplyMeetioneeId] = useState<string>()
  // 点击其他地方，取消唤起并清空参数
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target.tagName !== 'BUTTON' && target.tagName !== 'INPUT') {
      setIsReplierActive(false)
      setReplyRootCommentId(undefined)
      setReplyMeetioneeId(undefined)
    }
  })

  const handleReply = (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => {
    setIsReplierActive(true)
    setReplyRootCommentId(rootCommentId)
    setReplyMeetioneeId(meetioneeId)
  }

  const handleAddComment = async (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => {
    await addComment(noteId, content, rootCommentId, meetioneeId)
    fetchRootComments(noteId)
    setIsReplierActive(false)
    setReplyRootCommentId(undefined)
    setReplyMeetioneeId(undefined)
  }

  return (
    <>
      <ul>
        {rootComments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            handleReply={handleReply}
            unfoldReply={unfoldReply}
            likeComment={likeComment}
            cancelLikeComment={cancelLikeComment}
          />
        ))}
      </ul>
      <div>
        <Replier
          isReplierActive={isReplierActive}
          replyRootCommentId={replyRootCommentId}
          replyMeetioneeId={replyMeetioneeId}
          handleAddComment={handleAddComment}
        />
      </div>
    </>
  )
}
