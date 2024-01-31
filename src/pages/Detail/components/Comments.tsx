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
  like_count: number
  is_liked?: boolean
  author: {
    _id: string
    username: string
    avatar_url: string
  }
  mentionee?: {
    _id: string
    username: string
    avatar_url: string
  }
  created_at: string

  children?: Comment[]
  child_comment_count?: number
}

export const RenderComment: FC<{
  commentInit: Comment
  options: {
    root: {
      handleReply: (rootCommentId: string) => void
      unfoldReply: (commentId: string) => void
    } | null
    child: {
      handleReply: (
        rootCommentId: string,
        meetionee: {
          _id: string
          username: string
        },
      ) => void
    } | null
  }
  children?: React.ReactNode[]
}> = ({ commentInit, options, children }) => {
  const [comment, setComment] = useState(commentInit)
  return (
    <>
      <li>
        <div>
          <span>
            <img
              style={{
                width: '24px',
                height: '24px',
              }}
              src={'http://192.168.2.153:9527' + comment.author.avatar_url}
            ></img>
            <span style={{ color: '#999' }}>{comment.author.username}</span>
          </span>
          {comment.mentionee && (
            <span>
              →
              <img
                style={{
                  width: '24px',
                  height: '24px',
                }}
                src={comment.mentionee.avatar_url}
              ></img>
              <span style={{ color: '#999' }}>
                {comment.mentionee.username}
              </span>
            </span>
          )}
        </div>
        <p>{comment.content}</p>
        <p>{comment.created_at}</p>
        {comment.is_liked ? (
          <button
            onClick={async () => {
              const res = await cancelLikeComment(comment._id)
              setComment({ ...comment, ...res })
            }}
          >
            {comment.like_count}取消点赞
          </button>
        ) : (
          <button
            onClick={async () => {
              const res = await likeComment(comment._id)
              setComment({ ...comment, ...res })
            }}
          >
            {comment.like_count}点赞
          </button>
        )}
        {/* 根评论回复不传 mentionee */}
        <button
          onClick={() => {
            if (options.root) {
              console.log('root comment reply', options)
              options.root.handleReply(comment._id)
            }
            if (options.child) {
              console.log('child comment reply')
              options.child.handleReply(comment._id, comment.author)
            }
          }}
        >
          回复
        </button>
        {options.root?.unfoldReply && (
          <button onClick={() => options.root?.unfoldReply(comment._id)}>
            展开{comment.child_comment_count}条回复
          </button>
        )}
        {children ? <ul>{children}</ul> : null}
      </li>
    </>
  )
}

const Replier: FC<{
  isReplierActive: boolean
  replyRootCommentId?: string
  replyMeetionee?: {
    _id: string
    username: string
  }
  handleAddComment: (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => void
}> = ({
  isReplierActive,
  replyRootCommentId,
  replyMeetionee,
  handleAddComment,
}) => {
  const [content, setContent] = useState('')
  return (
    <div
      style={{
        // position: 'absolute',
        bottom: isReplierActive ? '200px' : '80px',
        // left: '0',
        // width: '100%',
        // backgroundColor: '#fff',
      }}
    >
      <label htmlFor="reply">
        回复
        {replyMeetionee && <span>@{replyMeetionee.username}</span>}
      </label>
      <input
        type="text"
        placeholder="评论"
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={() =>
          handleAddComment(content, replyRootCommentId, replyMeetionee?._id)
        }
      >
        评论
      </button>
    </div>
  )
}

export const Comments: FC<{ noteId: string }> = ({ noteId }) => {
  const [rootComments, setRootComments] = useState<Comment[]>([])
  const fetchRootComments = async (noteId: string) => {
    const res = await getRootComments(noteId)
    setRootComments(res)
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
  const [replyMeetionee, setReplyMeetionee] = useState<{
    _id: string
    username: string
  }>()
  // 点击其他地方，取消唤起并清空参数
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target.tagName !== 'BUTTON' && target.tagName !== 'INPUT') {
      setIsReplierActive(false)
      setReplyRootCommentId(undefined)
      setReplyMeetionee(undefined)
    }
  })

  const handleReply = (
    // 这个函数的调用只是唤起 Replier，并不会真正的添加评论，只是单纯确认位置，所以 content 是不需要的
    // 以及，调用时...点击根评论的回复按钮应该是传 rootCommentId 但没有 meetionee
    rootCommentId?: string,
    meetionee?: {
      _id: string
      username: string
    },
  ) => {
    setIsReplierActive(true)
    setReplyRootCommentId(rootCommentId)
    setReplyMeetionee(meetionee)
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
    setReplyMeetionee(undefined)
  }

  return (
    <>
      <ul>
        {rootComments?.map((comment) => (
          <RenderComment
            key={comment._id}
            commentInit={comment}
            options={{
              root: {
                handleReply,
                unfoldReply,
              },
              child: null,
            }}
          >
            {comment.children?.map((childComment) => (
              <RenderComment
                key={childComment._id}
                commentInit={childComment}
                options={{
                  root: null,
                  child: {
                    handleReply,
                  },
                }}
              />
            ))}
          </RenderComment>
        ))}
      </ul>
      <div>
        <Replier
          isReplierActive={isReplierActive}
          replyRootCommentId={replyRootCommentId}
          replyMeetionee={replyMeetionee}
          handleAddComment={handleAddComment}
        />
      </div>
    </>
  )
}
