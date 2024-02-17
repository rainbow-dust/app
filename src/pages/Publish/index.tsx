import React, { useState } from 'react'

import { Message } from '~/components/Message'
import { Pic, addNote } from '~/services'

import { ImgUpload } from './components/ImgUpload'
import { TagSelect } from './components/TagSelect'
import Classes from './index.module.css'

export const Publish: React.FC = () => {
  // 搜索 tag
  const [tags, setTags] = useState<string[]>([])

  const [picList, setPicList] = useState<Pic[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your logic to submit the note content here
    addNote(
      title,
      content,
      tags.map((t) => t), // 这里是 tag 的 name...
      picList,
    ).then((res) => {
      if (res) {
        Message.success('发布成功')
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
      <form onSubmit={handleSubmit}>
        <ImgUpload picList={picList} setPicList={setPicList} />
        <div>
          <input
            type="text"
            id="title"
            placeholder="填写标题会变可爱哦~"
            value={title}
            onChange={handleTitleChange}
            className={Classes['title-input']}
            style={{}}
          />

          <textarea
            id="content"
            placeholder="添加正文"
            value={content}
            onChange={handleContentChange}
            className={Classes['content-textarea']}
            style={{}}
          />
        </div>
        <TagSelect tags={tags} setTags={setTags} />
        <button type="submit" className={Classes['publish-button']}>
          发布~
        </button>
      </form>
    </div>
  )
}
