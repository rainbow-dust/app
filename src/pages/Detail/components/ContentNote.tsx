import React, { FC } from 'react'

export const ContentNote: FC<{
  title?: string
  content?: string
  tags?: { _id: string; name: string }[]
}> = ({ title, content, tags }) => {
  return (
    <>
      <h2>{title}</h2>
      <p>{content}</p>
      {tags?.map((tag) => (
        <span
          key={tag._id}
          style={{
            color: '#999',
            marginRight: '10px',
            border: '1px solid #999',
            borderRadius: '4px',
            padding: '0px 2px',
            fontSize: '14px',
          }}
        >
          {tag?.name}{' '}
        </span>
      ))}
    </>
  )
}
