import { FC } from 'react'

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
            color: 'var(--text-color-secondary)',
            marginRight: '10px',
            border: '1px solid var(--border-color)',
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
