import React, { useState } from 'react'

import { Pic, addNote } from '~/services'

import { ImgUpload } from './components/ImgUpload'
import { TagSelect } from './components/TagSelect'

interface Tag {
  name: string
  _id: string
}

export const Publish: React.FC = () => {
  const [chosenTags, setChosenTags] = useState<Tag[]>([])
  const [picList, setPicList] = useState<Pic[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your logic to submit the note content here
    addNote(
      title,
      content,
      chosenTags.map((t) => t._id),
      picList,
    )
  }

  const [title, setTitle] = useState('')
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const [content, setContent] = useState('')
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  return (
    <div>
      <h1>Content Publish Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <TagSelect chosenTags={chosenTags} setChosenTags={setChosenTags} />
        <ImgUpload picList={picList} setPicList={setPicList} />
        <button type="submit">Publish</button>
        <input type="file" accept="image/*" multiple />
      </form>
    </div>
  )
}
