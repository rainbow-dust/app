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

  const [hoveredIndex, setHoveredIndex] = useState(0)
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
      <div
        style={{
          position: 'relative',
        }}
      >
        <div
          className={Classes['tag-input']}
          onMouseEnter={setHoveredIndex.bind(null, 2)}
          onMouseLeave={setHoveredIndex.bind(null, -1)}
          onClick={() => {
            inputRef.current!.focus()
          }}
          style={{
            width: '170px',
            minHeight: '20px',
            border: hoveredIndex === 2 ? '1px solid red' : '1px solid black',
            borderRadius: '4px',
            display: 'flex',
          }}
        >
          {tags.map((tag) => {
            return (
              <span
                key={tag}
                style={{
                  margin: '2px 2px',
                  border: '1px solid black',
                }}
                onClick={() => {
                  setTags(tags.filter((t) => t !== tag))
                }}
              >
                {tag}
              </span>
            )
          })}
          <input
            style={{
              width: '2px',
              height: '20px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
            }}
            ref={inputRef}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
            }}
            onKeyDown={handleKeyDown}
          />
          {/* 可以通过这个 mirror 得到渲染后的文字宽度...tmd原来是这样用的 */}
          <span
            ref={inputMirrorRef}
            className={Classes['tag-input-mirror']}
            style={{
              color: 'transparent',
              position: 'absolute',
              top: '0',
              right: '0',
            }}
          >
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
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                zIndex: 100,
                background: 'white',
              }}
            >
              <div className={Classes.selectItem}>1</div>
              <div className={Classes['select-item']}>1</div>
              <div className={Classes['select-item']}>1</div>
              <div className={Classes['select-item']}>1</div>
              <div className={Classes['select-item']}>2</div>
              <div className={Classes['select-item']}>3</div>
            </div>
          </ClickOutSide>
        )}
      </div>
    </div>
  )
}
