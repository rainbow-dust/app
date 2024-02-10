import { FC } from 'react'
import { BsFillHeartFill, BsHeart } from 'react-icons/bs'

import Classes from './Like.module.css'

interface IconLikeProps {
  isLiked: boolean
  handleLike: () => void
  handleCancelLike: () => void
}

const IconLike: FC<IconLikeProps> = ({
  isLiked,
  handleLike,
  handleCancelLike,
}) => {
  return (
    <span>
      {isLiked ? (
        <BsFillHeartFill
          className={[Classes['like'], Classes['ed']].join(' ')}
          onClick={handleCancelLike}
        />
      ) : (
        <BsHeart
          className={[Classes['like'], Classes['tobe']].join(' ')}
          onClick={handleLike}
        />
      )}
    </span>
  )
}

export { IconLike }
