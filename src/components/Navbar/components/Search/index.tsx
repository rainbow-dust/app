import React, { useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

import { queryTags } from '~/services'

import { Dropdown } from '../../../Dropdown'
import Classes from './index.module.css'

interface Option {
  value: string
  label: string
}

export const Search = () => {
  const [str, setStr] = useState('')
  const searchFn = async (str: string) => {
    const res = await queryTags(str)

    const options = res.map((t: { name: string; _id: string }) => {
      return {
        value: t.name,
        label: t.name,
      }
    })
    return options
  }

  const navigate = useNavigate()
  const [options, setOptions] = useState<Option[]>([])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/search?keyword=${str}`)
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
                style={{
                  outline: 'none',
                  border: 'none',
                  width: '100%',
                  height: '100%',
                  borderRadius: '4px',
                }}
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
                    navigate(`/search?keyword=${option.label}`)
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
