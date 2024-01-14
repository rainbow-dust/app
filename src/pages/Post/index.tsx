import React, { useState } from 'react'

import { addPost } from '@/services'
import { upload } from '@/services'

export const Post = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [fileUrls, setFileUrls] = useState<string[]>([])
  // 宽高的事... 再看

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value.split(','))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your logic to submit the post content here
    addPost(title, content, tags, fileUrls)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    const { url } = await upload(file)
    console.log(url)
    setFileUrls([...fileUrls, url])
  }

  return (
    <div>
      <h1>Content Publish Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">Files:</label>
        <input type="file" id="file" onChange={handleFileChange} />
        <div>
          {fileUrls.map((url, index) => (
            <div>
              <img key={index} src="" alt={url} />
            </div>
          ))}
        </div>

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
        <div>
          <label htmlFor="tags">Tags:</label>
          <input type="text" value={tags} onChange={handleTagsChange} />
        </div>
        <button type="submit">Publish</button>
      </form>
    </div>
  )
}
