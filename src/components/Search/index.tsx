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

  const [searchValue, setSearchValue] = useState('')
  const [tags, setTags] = useState<string[]>([]) // 这里的 tag 就应该是 selectedCells....

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  // 听 input 是否 focus，然后给 tag-input 加上 focus 的样式...不...focus 和 active 可能得是两回事...
  const [isActive, setIsActive] = useState(false)
  useEffect(() => {
    const handleFocus = () => {
      setIsActive(true)
    }
    inputRef.current!.addEventListener('focus', handleFocus)
    const inputRefCurrent = inputRef.current
    return () => {
      inputRefCurrent!.removeEventListener('focus', handleFocus)
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
    <div
      className={Classes['search'] + (isActive ? ' ' + Classes['active'] : '')}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        <ClickOutSide
          onClickOutSide={() => {
            setIsActive(false)
            console.log('click outside')
          }}
        >
          <div
            className={Classes['tag-input']}
            style={isActive ? { border: '1px solid #1890ff' } : {}}
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
          {isActive && (
            <div className={Classes['dropdown']}>
              <div
                style={{
                  backgroundColor: '#1890ff',
                  color: 'white',
                  padding: '5px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="https://avatars.githubusercontent.com/u/32326916?s=460&u=5d3c1f3b0c8b9b9d8d8f0b6d6c4f9f0e3e7e0d3f&v=4"
                  alt="avatar"
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    marginRight: '5px',
                  }}
                />
                this is some special item
              </div>
              <div className={Classes['dropdown-item']}>1</div>
              <div className={Classes['dropdown-item']}>1</div>
              <div className={Classes['dropdown-item']}>1</div>
              <div className={Classes['dropdown-item']}>2</div>
              <div className={Classes['dropdown-item']}>3</div>
            </div>
          )}{' '}
          {/* <Dropdown
              cells={cells}
              selectedCells={selectedCells}
              setSelectedCells={setSelectedCells}
            /> */}
        </ClickOutSide>
      </div>
    </div>
  )
}
