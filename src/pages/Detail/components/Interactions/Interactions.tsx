import { FC } from 'react'

import { Replier } from './Replier'

export const Interactions: FC<{
  handleAddComment: (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => void
  Like: FC
  Collect: FC
}> = ({ handleAddComment, Like, Collect }) => {
  return (
    <div>
      <Like />
      <Collect />
      <Replier handleAddComment={handleAddComment} />
    </div>
  )
}
