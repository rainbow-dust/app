import React, { FC } from 'react'

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
        borderBottom: '1px solid #000',
      }}
    >
      <img
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          marginRight: '10px',
        }}
        src={'http://192.168.2.153:9527' + author?.avatar_url}
        alt="avatar"
      />
      <span>{author?.username}</span>
    </div>
  )
}
