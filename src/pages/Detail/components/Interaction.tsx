import React, { FC, useContext, useState } from 'react'

import { ReplierContext } from '~/hooks/useReplier'

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
    <div
      style={{
        // position: 'absolute',
        bottom: replier.isActive ? '200px' : '80px',
        // left: '0',
        // width: '100%',
        // backgroundColor: '#fff',
      }}
    >
      <label htmlFor="reply">
        回复
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
