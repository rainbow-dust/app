import React, { FC, useEffect, useRef, useState } from 'react'

import { ClickOutSideProvider as ClickOutSide } from '../../hooks/useClickOutSide'
import Classes from './index.module.css'

interface Option {
  value: string
  label: string
}

export const Search: FC<{
  str: string
  tags: string[]
  setStr: (str: string) => void
  setTags: (tags: string[]) => void
  searchFn: (str: string) => Promise<Option[]>
}> = ({ str, tags, setStr, setTags, searchFn }) => {
  const [options, setOptions] = useState<Option[]>([])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (tags.includes(str)) {
        setStr('')
        return
      }
      setTags([...tags, str])
      setStr('')
      return
    }
    if (e.key === 'Escape') {
      return
    }
    setStr(e.currentTarget.value)
    const options = await searchFn(e.currentTarget.value)
    setOptions(options)
  }

  const inputMirrorRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 同步 inputMirror 和 input 的宽度 css
  useEffect(() => {
    if (inputMirrorRef.current!.innerText) {
      inputMirrorRef.current!.innerText = str
      inputRef.current!.style.width = inputMirrorRef.current!.offsetWidth + 'px'
    }
  }, [str, inputRef])

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
            style={isActive ? { border: '1px solid var(--border-color)' } : {}}
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
              value={str}
              onChange={(e) => {
                setStr(e.target.value)
              }}
              onKeyDown={handleKeyDown}
            />
            {/* 可以通过这个 mirror 得到渲染后的文字宽度...tmd原来是这样用的 */}
            <span ref={inputMirrorRef} className={Classes['tag-input-mirror']}>
              {str}
            </span>
          </div>
          {isActive && (
            <div className={Classes['dropdown']}>
              {options.map((option) => {
                return (
                  <div
                    key={option.value}
                    className={Classes['dropdown-item']}
                    onClick={() => {
                      if (tags.includes(option.value)) {
                        setTags(tags.filter((t) => t !== option.value))
                      } else {
                        setTags([...tags, option.value])
                      }
                    }}
                  >
                    {option.label}
                    {tags.includes(option.value) ? '✅' : ''}
                  </div>
                )
              })}
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
