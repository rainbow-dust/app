import React, { useEffect, useRef, useState } from 'react'

import { ClickOutSide } from './ClickOutSide'
import Classes from './index.module.css'

export const Search: React.FC<{
  options: string[]
  handleKeyDownFn: () => void
  searchFn: () => void
  noDataLabel: string
  placeholder: string
  loading: boolean
  multiple: boolean
}> = ({
  options,
  handleKeyDownFn,
  searchFn,
  noDataLabel,
  placeholder,
  loading,
  multiple,
}) => {
  // TODO:
  console.log(
    'search',
    options,
    handleKeyDownFn,
    searchFn,
    noDataLabel,
    placeholder,
    loading,
    multiple,
  )

  const [showDropdown, setShowDropdown] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setShowDropdown(true)
    if (e.key === 'Enter') {
      if (tags.includes(searchValue)) {
        setSearchValue('')
        return
      }
      setTags([...tags, searchValue])
      setSearchValue('')
      console.log('enter')
      return
    }
    if (e.key === 'Escape') {
      console.log('escape')
      return
    }
    setSearchValue(e.currentTarget.value)
  }

  const inputMirrorRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 同步 inputMirror 和 input 的宽度 css
  useEffect(() => {
    if (inputMirrorRef.current!.innerText) {
      inputMirrorRef.current!.innerText = searchValue
      inputRef.current!.style.width = inputMirrorRef.current!.offsetWidth + 'px'
    }
  }, [searchValue, inputRef])

  return (
    <div>
      <div className={Classes['search']}>
        <div
          className={Classes['tag-input']}
          onClick={() => {
            inputRef.current!.focus()
          }}
        >
          {tags.map((tag) => {
            return (
              <span
                key={tag}
                className={Classes['tag-input-tag']}
                onClick={() => {
                  setTags(tags.filter((t) => t !== tag))
                }}
              >
                {tag}
              </span>
            )
          })}
          <input
            className={Classes['tag-input-input']}
            ref={inputRef}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
            }}
            onKeyDown={handleKeyDown}
          />
          {/* 可以通过这个 mirror 得到渲染后的文字宽度...tmd原来是这样用的 */}
          <span ref={inputMirrorRef} className={Classes['tag-input-mirror']}>
            {searchValue}
          </span>
        </div>
        {showDropdown && (
          <ClickOutSide
            onClickOutSide={() => {
              console.log('click outside')
              setShowDropdown(false)
            }}
          >
            <div className={Classes['dropdown']}>
              <div className={Classes['dropdown-item']}>1</div>
              <div className={Classes['dropdown-item']}>1</div>
              <div className={Classes['dropdown-item']}>1</div>
              <div className={Classes['dropdown-item']}>2</div>
              <div className={Classes['dropdown-item']}>3</div>
            </div>
          </ClickOutSide>
        )}
      </div>
    </div>
  )
}
