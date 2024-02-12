import React, { useState } from 'react'

import { Message } from '~/components/Message'
import { Search } from '~/components/Search'
import { Pic, addNote, addTag, queryTags } from '~/services'

import { ImgUpload } from './components/ImgUpload'
import Classes from './index.module.css'

interface Tag {
  name: string
  _id: string
}

export const Publish: React.FC = () => {
  // 搜索 tag
  const [str, setStr] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isNewTag, setIsNewTag] = useState(false)

  const searchFn = async (str: string) => {
    const res = await queryTags(str)

    const options = res.map((t: Tag) => {
      return {
        value: t.name,
        label: t.name,
      }
    })
    setIsNewTag(false)
    if (
      str &&
      (options.length === 0 ||
        (options.length === 1 && options[0].value !== str))
    ) {
      setIsNewTag(true)
    }

    return options
  }

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

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Search
            str={str}
            tags={tags}
            setStr={setStr}
            setTags={setTags}
            searchFn={searchFn}
          />
          {isNewTag && (
            <button
              style={{
                marginLeft: '10px',
              }}
              onClick={async (e) => {
                e.preventDefault()
                const res = await addTag(str)
                setTags([...tags, res.name])
              }}
            >
              create tag
            </button>
          )}
        </div>
        <button type="submit" className={Classes['publish-button']}>
          发布~
        </button>
      </form>
    </div>
  )
}
