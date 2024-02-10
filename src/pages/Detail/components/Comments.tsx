import { FC, useContext, useEffect, useState } from 'react'
import { BsChatDots, BsHeart, BsHeartFill } from 'react-icons/bs'

import Avatar from '~/components/Avatar'
// 我也想加动画...可是下面这个东西打包一下子多了 300kb 比我的整个项目还大...
// import UseAnimations from 'react-useanimations';
// import heart from 'react-useanimations/lib/heart';

import { ReplierContext } from '~/hooks/useReplier'
import {
  addComment,
  cancelLikeComment,
  getChildComments,
  getRootComments,
  likeComment,
} from '~/services'

import { Replier } from './Interaction'

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

  root_comment_id?: string
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
      <div
        style={{
          margin: '16px',
        }}
      >
        <div>
          <span>
            <Avatar
              imageUrl={
                import.meta.env.VITE_FURINA_APP_IMG_URL +
                comment.author.avatar_url
              }
              altText={comment.author.username}
              size={24}
              peopleLink={`/people/${comment.author.username}`}
            />
            <span style={{ color: 'var(--text-color-secondary)' }}>
              {comment.author.username}
            </span>
          </span>
          {comment.mentionee && (
            <span>
              →
              <Avatar
                imageUrl={
                  import.meta.env.VITE_FURINA_APP_IMG_URL +
                  comment.mentionee.avatar_url
                }
                altText={comment.mentionee.username}
                size={24}
                peopleLink={`/people/${comment.mentionee.username}`}
              />
              <span style={{ color: 'var(--text-color-secondary)' }}>
                {comment.mentionee.username}
              </span>
            </span>
          )}
        </div>
        <div
          style={{
            marginLeft: '20px',
            marginTop: '10px',
          }}
        >
          <div>{comment.content}</div>
          <div
            style={{
              color: 'var(--text-color-secondary)',
            }}
          >
            <div
              style={{
                fontSize: '14px',
              }}
            >
              {comment.created_at}
            </div>
            <span
            // style={{
            //   display: 'flex',
            //   alignItems: 'center',
            //   marginLeft: '10px',
            //   fontSize: '16px',
            // }}
            >
              {comment.is_liked ? (
                <BsHeartFill
                  style={{
                    color: 'var(--theme-color)',
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    const res = await cancelLikeComment(comment._id)
                    setComment({ ...comment, ...res })
                  }}
                />
              ) : (
                <BsHeart
                  style={{
                    color: 'var(--theme-color)',
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    const res = await likeComment(comment._id)
                    setComment({ ...comment, ...res })
                  }}
                />
              )}
              {comment.like_count}
            </span>

            {/* 根评论回复不传 mentionee */}
            <BsChatDots
              style={{
                color: 'var(--theme-color)',
                cursor: 'pointer',
                marginRight: '5px',
              }}
              onClick={() => {
                if (options.root) {
                  options.root.handleReply(comment._id)
                }
                if (options.child) {
                  options.child.handleReply(
                    comment.root_comment_id as string,
                    comment.author,
                  )
                }
              }}
            />
            {comment.child_comment_count ??
              (comment.child_comment_count === 0 && '回复')}

            {options.root?.unfoldReply && comment.child_comment_count && (
              <button onClick={() => options.root?.unfoldReply(comment._id)}>
                展开{comment.child_comment_count}条回复
              </button>
            )}
          </div>
          {children ? <div>{children}</div> : null}
        </div>
      </div>
    </>
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

  const { setReplier } = useContext(ReplierContext)
  const handleReply = (
    // 这个函数的调用只是唤起 Replier，并不会真正的添加评论，只是单纯确认位置，所以 content 是不需要的
    // 以及，调用时...点击根评论的回复按钮应该是传 rootCommentId 但没有 meetionee
    rootCommentId?: string,
    meetionee?: {
      _id: string
      username: string
    },
  ) => {
    setReplier({
      isActive: true,
      rootCommentId: rootCommentId,
      noteId: noteId,
      meetionee: meetionee,
    })
  }

  const handleAddComment = async (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => {
    await addComment({
      content,
      note_id: noteId,
      root_comment_id: rootCommentId,
      mentionee_id: meetioneeId,
    })
    fetchRootComments(noteId)
    setReplier({
      isActive: false,
      rootCommentId: undefined,
      noteId: '',
      meetionee: undefined,
    })
  }

  return (
    <>
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
      <div>
        <Replier handleAddComment={handleAddComment} />
      </div>
    </>
  )
}
