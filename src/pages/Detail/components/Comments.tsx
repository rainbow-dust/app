import { FC, useEffect, useState } from 'react'

// import useSWR, { useSWRConfig } from 'swr'

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
}

interface RootComment extends Comment {
  children?: Comment[]
  child_comment_count?: number
}

// 处理 root 和 非 root ..感觉也应该放到外面的组件里去...？
// 这样做主要是...md 回显怎么做，如果每个小东西里面都有个useState就方便好多了...

const Comment: FC<{
  comment: RootComment
  handleReply: (
    rootCommentId?: string,
    meetionee?: {
      _id: string
      username: string
    },
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
      <p>
        <img
          style={{
            width: '24px',
            height: '24px',
          }}
          src={comment.author.avatar_url}
        ></img>
        <span style={{ color: '#999' }}>{comment.author.username}</span>
      </p>
      <p>{comment.content}</p>
      <p>{comment.created_at}</p>
      <p></p>
      {comment.is_liked ? (
        <button onClick={() => cancelLikeComment(comment._id)}>
          {comment.like_count}取消点赞
        </button>
      ) : (
        <button onClick={() => likeComment(comment._id)}>
          {comment.like_count}点赞
        </button>
      )}
      {/* 根评论回复不传 mentionee */}
      <button onClick={() => handleReply(comment._id)}>回复</button>

      {comment.child_comment_count && comment.child_comment_count > 0 && (
        <button onClick={() => unfoldReply(comment._id)}>
          展开{comment.child_comment_count}条回复
        </button>
      )}
      <ul>
        {comment.children &&
          comment.children.map((child) => (
            <li key={child._id}>
              <span>
                <img
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                  src={child.author.avatar_url}
                ></img>
                <span style={{ color: '#999' }}>{child.author.username}</span>
              </span>
              {child.mentionee && (
                <span>
                  →
                  <img
                    style={{
                      width: '24px',
                      height: '24px',
                    }}
                    src={child.mentionee?.avatar_url}
                  ></img>
                  <span style={{ color: '#999' }}>
                    {child.mentionee?.username}
                  </span>
                </span>
              )}
              <p>{child.content}</p>
              <p>{child.created_at}</p>
              {child.is_liked ? (
                <button onClick={() => cancelLikeComment(child._id)}>
                  {child.like_count}取消点赞
                </button>
              ) : (
                <button onClick={() => likeComment(child._id)}>
                  {child.like_count}点赞
                </button>
              )}
              <button onClick={() => handleReply(comment._id, child.author)}>
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
  // 我不确定这里要怎么做... swr 的数据似乎很强调和后端保持一致，但这里需要组成嵌套的...吗？
  const [rootComments, setRootComments] = useState<RootComment[]>([])
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
          replyMeetionee={replyMeetionee}
          handleAddComment={handleAddComment}
        />
      </div>
    </>
  )
}
