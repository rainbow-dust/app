import { FC } from 'react'
import { BsStar, BsStarFill } from 'react-icons/bs'

import Classes from './Collect.module.css'

interface IconCollectProps {
  isCollected: boolean
  handleCollect: () => void
  handleCancelCollect: () => void
}

const IconCollect: FC<IconCollectProps> = ({
  isCollected,
  handleCollect,
  handleCancelCollect,
}) => {
  return (
    <span>
      {isCollected ? (
        <BsStarFill
          className={[Classes['collect'], Classes['ed']].join(' ')}
          onClick={handleCancelCollect}
        />
      ) : (
        <BsStar
          className={[Classes['collect'], Classes['tobe']].join(' ')}
          onClick={handleCollect}
        />
      )}
    </span>
  )
}

export { IconCollect }
