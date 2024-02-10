import { FC, useContext, useState } from 'react'

import { ReplierContext } from '~/hooks/useReplier'

import Classes from './Interaction.module.css'

export const Replier: FC<{
  handleAddComment: (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => void
}> = ({ handleAddComment }) => {
  const [content, setContent] = useState('')
  const { replier } = useContext(ReplierContext)
  return (
    <div className={Classes['replier']}>
      <label htmlFor="reply">
        {replier.meetionee && <span>@{replier.meetionee.username}</span>}
      </label>
      <input
        type="text"
        placeholder="评论"
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={() =>
          handleAddComment(
            content,
            replier.rootCommentId,
            replier.meetionee?._id,
          )
        }
      >
        评论
      </button>
    </div>
  )
}

// export const Interaction: FC<{
//   handleAddComment: (
//     content: string,
//     rootCommentId?: string,
//     meetioneeId?: string,
//   ) => void

// 下面这些可以直接传 icon 进来。但不管怎样应该先把 reply 不放到 comment 里面
// handleLikeNote: () => void
// handleCancelLikeNote: () => void
// handleCollectNote: () => void

// isLiked: boolean
// isCollected: boolean
