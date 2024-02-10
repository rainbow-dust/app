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

export const Interaction: FC<{
  handleAddComment: (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => void
  Like: FC
  Collect: FC
}> = ({ handleAddComment, Like, Collect }) => {
  return (
    <div className={Classes['interaction']}>
      <Like />
      <Collect />
      <Replier handleAddComment={handleAddComment} />
    </div>
  )
}
