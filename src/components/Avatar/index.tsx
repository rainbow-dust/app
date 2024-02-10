import React from 'react'
import { Link } from 'react-router-dom'

type AvatarProps = {
  imageUrl: string
  altText: string
  size?: number
  peopleLink?: string
}

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  altText,
  size = 24,
  peopleLink,
}) => {
  return (
    <Link to={peopleLink || ''}>
      <img
        src={imageUrl}
        alt={altText}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          verticalAlign: 'middle',
        }}
      />
    </Link>
  )
}

export default Avatar
