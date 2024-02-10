import { FC } from 'react'

import Avatar from '~/components/Avatar'

export const ContentAuthor: FC<{
  author?: { username: string; avatar_url: string }
}> = ({ author }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        marginBottom: '10px',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <Avatar
        imageUrl={import.meta.env.VITE_FURINA_APP_IMG_URL + author?.avatar_url}
        altText={author?.username || 'avatar'}
        size={40}
        peopleLink={`/people/${author?.username}`}
      />
      <span>{author?.username}</span>
    </div>
  )
}
