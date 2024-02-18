import React, { FC, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

import { Dropdown } from '../Dropdown'
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
  const navigate = useNavigate()
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
    if (e.key === 'Backspace' && str === '') {
      setTags(tags.slice(0, -1))
      return
    }
    setStr(e.currentTarget.value)
    const options = await searchFn(e.currentTarget.value)
    setOptions(options)
  }

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div className={Classes['search']}>
        <Dropdown
          Toggle={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '24px',
                width: '100%',
                borderRadius: '4px',
                backgroundColor: 'rgba(0,0,0,0.05)',
                cursor: 'pointer',
              }}
            >
              <input
                value={str}
                onChange={(e) => setStr(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索"
              />
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                }}
              >
                <BsSearch
                  onClick={() => {
                    navigate(`/search?keyword=${str}`)
                  }}
                />
              </div>
            </div>
          }
          Menu={
            <div className={Classes['dropdown']}>
              {options.map((option) => (
                <div
                  className={Classes['dropdown-item']}
                  key={option.value}
                  onClick={() => {
                    setStr(option.label)
                    setTags([...tags, option.label])
                    setOptions([])
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          }
        />
      </div>
    </div>
  )
}
