import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import Classes from './ContentNote.module.css'

export const ContentNote: FC<{
  title?: string
  content?: string
  tags?: { _id: string; name: string }[]
}> = ({ title, content, tags }) => {
  const navigate = useNavigate()
  return (
    <>
      <h2>{title}</h2>
      <p>{content}</p>
      {tags?.map((tag) => (
        <span
          key={tag._id}
          className={Classes['content-tag']}
          onClick={() => {
            navigate(`/tag/${tag.name}`)
          }}
        >
          {tag?.name}
        </span>
      ))}
    </>
  )
}
