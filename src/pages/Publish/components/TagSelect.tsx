import React, { useEffect, useRef, useState } from 'react'

import { addTag, queryTags } from '~/services'

import classes from './TagSelect.module.css'

interface Tag {
  name: string
  _id: string
}

export const TagSelect: React.FC<{
  chosenTags: Tag[]
  setChosenTags: React.Dispatch<React.SetStateAction<Tag[]>>
}> = ({ chosenTags, setChosenTags }) => {
  const [tobeChosenTags, setTobeChosenTags] = useState<Tag[]>([])
  const [queryStr, setQueryStr] = useState<string>('')
  const [addNew, setAddNew] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showResult, setShowResult] = useState<boolean>(false)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (inputRef.current && inputRef.current.contains(e.target as Node)) {
        setShowResult(true)
      } else {
        setShowResult(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const getTobeChosenTags = async (queryStr: string) => {
    if (queryStr === '') {
      setQueryStr('')
      setTobeChosenTags([])
      return
    }

    setQueryStr(queryStr)
    const tags = await queryTags(queryStr)
    if (tags.length === 0) {
      setAddNew(true)
    } else {
      setAddNew(false)
    }
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

  const handleAddTag = async () => {
    setAddNew(false)
    const tag = await addTag(queryStr)
    setQueryStr('')
    setChosenTags([...chosenTags, tag])
  }

  return (
    <>
      <div>
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
        <br />

        <label htmlFor="tags">Tags:</label>
        <div className={classes.searchSelect}>
          <input
            className={classes.rnput}
            type="text"
            id="tags"
            autoComplete="off"
            value={queryStr}
            ref={inputRef}
            onChange={(e) => getTobeChosenTags(e.target.value)}
          />
          <ul
            className={classes.result}
            style={{ display: showResult ? 'block' : 'none' }}
          >
            {tobeChosenTags?.map((tag) => (
              <li
                key={tag._id}
                style={{ cursor: 'pointer', border: '1px solid black' }}
                onClick={() => chooseTag(tag)}
              >
                {tag.name}
              </li>
            ))}
          </ul>
          {addNew && (
            <button type="button" onClick={handleAddTag}>
              Add
            </button>
          )}
        </div>
      </div>
    </>
  )
}
