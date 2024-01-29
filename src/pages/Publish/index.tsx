import React, { useState } from 'react'

import { Pic, addNote } from '~/services'

import { ImgUpload } from './components/ImgUpload'
import { TagSelect } from './components/TagSelect'
import Classes from './index.module.css'

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
    ).then((res) => {
      if (res) {
        window.alert('Note published successfully')
      }
    })
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
          <input
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            className={Classes['title-input']}
            style={{}}
          />
        </div>

        <div>
          <textarea
            id="content"
            placeholder="type your content here"
            value={content}
            onChange={handleContentChange}
            className={Classes['content-textarea']}
            style={{}}
          />
        </div>
        <TagSelect chosenTags={chosenTags} setChosenTags={setChosenTags} />
        <ImgUpload picList={picList} setPicList={setPicList} />
        <div>i have read and agree to xxxxxxx</div>
        <button
          type="submit"
          style={{
            width: '100px',
            height: '50px',
            border: '1px solid black',
            margin: '5px',
            position: 'relative',
            backgroundColor: 'skyblue',
            cursor: 'pointer',
          }}
        >
          Publish
        </button>
      </form>
    </div>
  )
}
