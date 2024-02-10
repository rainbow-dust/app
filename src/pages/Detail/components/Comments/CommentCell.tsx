import React, { FC, useState } from 'react'
import { BsChatDots } from 'react-icons/bs'

import Avatar from '~/components/Avatar'
import { IconLike } from '~/components/Icons'
import { cancelLikeComment, likeComment } from '~/services'

import { Comment } from './Comments'

export const CommentCell: FC<{
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
              <IconLike
                isLiked={comment?.is_liked || false}
                handleLike={async () => {
                  const res = await likeComment(comment._id)
                  setComment({ ...comment, ...res })
                }}
                handleCancelLike={async () => {
                  const res = await cancelLikeComment(comment._id)
                  setComment({ ...comment, ...res })
                }}
              />
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
