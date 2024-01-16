import React, { useState } from 'react'

import { addPost, queryTags, upload } from '@/services'

interface Tag {
  name: string
  _id: string
}

export const Publish = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your logic to submit the post content here
    addPost(
      title,
      content,
      chosenTags.map((t) => t.name),
      fileUrls,
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

  const [chosenTags, setChosenTags] = useState<Tag[]>([])
  const [tobeChosenTags, setTobeChosenTags] = useState<Tag[]>([])
  const [queryStr, setQueryStr] = useState<string>('')

  const getTobeChosenTags = async (queryStr: string) => {
    setQueryStr(queryStr)
    const tags = await queryTags(queryStr)
    setTobeChosenTags(
      tags.filter((t: Tag) => !chosenTags.find((c) => c._id === t._id)),
    )
  }

  const chooseTag = (tag: Tag) => {
    setChosenTags([...chosenTags, tag])
    setTobeChosenTags(tobeChosenTags.filter((t) => t._id !== tag._id))
  }
  const unchooseTag = (tag: Tag) => {
    setChosenTags(chosenTags.filter((t) => t._id !== tag._id))
    setTobeChosenTags([...tobeChosenTags, tag])
  }

  const [fileUrls, setFileUrls] = useState<string[]>([])
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
          <input
            type="text"
            id="tags"
            value={queryStr}
            onChange={(e) => getTobeChosenTags(e.target.value)}
          />
          <div>chosenTags:</div>
          {chosenTags?.map((tag) => (
            <span
              key={tag._id}
              style={{
                cursor: 'pointer',
                color: 'red',
                border: '1px solid black',
              }}
              onClick={() => unchooseTag(tag)}
            >
              {tag.name}
            </span>
          ))}
          <div>tobeChosenTags:</div>

          {tobeChosenTags?.map((tag) => (
            <span
              key={tag._id}
              style={{ cursor: 'pointer', border: '1px solid black' }}
              onClick={() => chooseTag(tag)}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <button type="submit">Publish</button>
      </form>
    </div>
  )
}
