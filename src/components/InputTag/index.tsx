import React, { useState } from 'react'

import './index.css'

export const InputTag: React.FC = () => {
  const [value, setValue] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1) {
      setValue(value + e.key)
    } else if (e.key === 'Backspace') {
      setValue(value.slice(0, value.length - 1))
      if (value.length === 0) {
        setTags(tags.slice(0, tags.length - 1))
      }
    } else if (e.key === 'Enter' && value.length > 0) {
      setTags([...tags, value])
      setValue('')
    }
  }
  const handleDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <div className="tags-content">
      {tags.map((item, index) => (
        <span className="tag" key={index}>
          {item}
          <span
            className="tag-close"
            onClick={() => handleDelete(index)}
          ></span>
        </span>
      ))}
      <span
        className="tags-input"
        placeholder="添加标签"
        onKeyDown={handleKeyDown}
      >
        {value}
      </span>
      <span className="caret"></span>
    </div>
  )
}
