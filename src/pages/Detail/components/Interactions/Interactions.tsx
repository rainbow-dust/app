import { FC } from 'react'

import Classes from './Interactions.module.css'
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
    <div className={Classes['interactions']}>
      <div className={Classes['replier']}>
        <Replier handleAddComment={handleAddComment} />
      </div>
      <div className={Classes['action']}>
        <Like />
      </div>
      <div className={Classes['action']}>
        <Collect />
      </div>
    </div>
  )
}
