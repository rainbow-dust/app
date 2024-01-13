import React, { useState } from 'react'

import { addPost } from '@/services'

export const Post = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])

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
    addPost(title, content, tags)
  }

  return (
    <div>
      <h1>Content Publish Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
        />

        <label htmlFor="content">Content:</label>
        <textarea id="content" value={content} onChange={handleContentChange} />
        <label htmlFor="tags">Tags:</label>
        <input type="text" value={tags} onChange={handleTagsChange} />

        <button type="submit">Publish</button>
      </form>
    </div>
  )
}
