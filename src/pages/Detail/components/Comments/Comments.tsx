import {
  FC,
  useContext,
  useEffect,
  useImperativeHandle,
  useReducer,
} from 'react'

import { ReplierContext } from '~/hooks/useReplier'
import { getChildComments, getRootComments } from '~/services'

import { CommentCell } from './CommentCell'

export interface Comment {
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

export interface CommentsRef {
  fetchRootComments: (noteId: string) => void
  unfoldReply: (commentId: string) => void
}

export const Comments: FC<{
  onRef?: React.Ref<CommentsRef>
  noteId: string
}> = ({ noteId, onRef }) => {
  const [rootComments, setRootComments] = useReducer(
    (
      state: Comment[],
      action: {
        type: 'init' | 'open-children'
        payload: {
          comments: Comment[]
          rootCommentId?: string
        }
      },
    ) => {
      switch (action.type) {
        case 'init':
          return action.payload.comments
        case 'open-children':
          return state.map((comment) => {
            if (comment._id === action.payload.rootCommentId) {
              comment.children = action.payload.comments
              return comment
            }
            return comment
          })
      }
    },
    [],
  )

  const fetchRootComments = async (noteId: string) => {
    const res = await getRootComments(noteId)
    setRootComments({
      type: 'init',
      payload: {
        comments: res,
      },
    })
  }

  useEffect(() => {
    fetchRootComments(noteId)
  }, [noteId])

  const unfoldReply = async (commentId: string) => {
    const res = await getChildComments(commentId)
    setRootComments({
      type: 'open-children',
      payload: {
        comments: res.data,
        rootCommentId: commentId,
      },
    })
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

  useImperativeHandle(onRef, () => ({
    fetchRootComments,
    unfoldReply,
  }))

  if (!rootComments) return <div>loading...</div>
  if (rootComments.length === 0)
    return (
      <div
        style={{
          color: 'var(--text-color-secondary)',
        }}
      >
        还没有评论哦，快来一条吧
      </div>
    )

  return (
    <>
      <div
        style={{
          color: 'var(--text-color-secondary)',
        }}
      >
        共{rootComments.length}条根评论
      </div>
      {rootComments?.map((comment) => (
        <CommentCell
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
            <CommentCell
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
        </CommentCell>
      ))}
    </>
  )
}
