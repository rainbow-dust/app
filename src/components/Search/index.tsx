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
  const [tags, setTags] = useState<string[]>([]) // 这里的 tag 就应该是 selectedCells....

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setShowDropdown(true)
    if (e.key === 'Enter') {
      if (tags.includes(searchValue)) {
        setSearchValue('')
        return
      }
      setTags([...tags, searchValue])
      setSearchValue('')
      return
    }
    if (e.key === 'Escape') {
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

  // 听 input 是否 focus，然后给 tag-input 加上 focus 的样式
  useEffect(() => {
    const handleFocus = () => {
      console.log('focus')
    }
    const handleBlur = () => {
      console.log('blur')
    }
    inputRef.current!.addEventListener('focus', handleFocus)
    inputRef.current!.addEventListener('blur', handleBlur)
    return () => {
      inputRef.current!.removeEventListener('focus', handleFocus)
      inputRef.current!.removeEventListener('blur', handleBlur)
    }
  }, [])

  // 远程 tag 搜索
  // const [cells, setCells] = useState<string[]>([])
  // const [selectedCells, setSelectedCells] = useState<string[]>([])
  // useEffect(() => {
  //   if (searchValue) {
  //     const res = searchFn()
  //     setCells(res)
  //   }
  // }, [searchValue, searchFn])

  // 最终提交...虽然可能也是搜索...
  // useEffect(() => {
  //   if (handleKeyDownFn) {
  //     handleKeyDownFn()
  //   }
  // }, [handleKeyDownFn])

  // 之后做什么呢...? 嗯，还剩，嗯... 弹窗问题...不只是这里，还有那个 notes 的弹窗也是...
  // 以及很早很早以前你想的要不要给 notes 单页面搞单个 note 的相关推荐... 也许是要做的...
  // 或者先试试底部侧边栏改
  // 还有各种各样各种地方的小东西，比如用户信息，action bar...
  // 以及很多很大的东西...像样式，主题，适配... 以及后端那些...

  return (
    <div>
      <div className={Classes['search']}>
        <div
          className={Classes['tag-input']}
          style={showDropdown ? { border: '1px solid #1890ff' } : {}}
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
            {/* <Dropdown
              cells={cells}
              selectedCells={selectedCells}
              setSelectedCells={setSelectedCells}
            /> */}
          </ClickOutSide>
        )}
      </div>
    </div>
  )
}
