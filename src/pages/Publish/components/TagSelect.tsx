import { useState } from 'react'

import { Dropdown } from '~/components/Dropdown'
import { addTag, queryTags } from '~/services'

interface Tag {
  name: string
  heat: number
  _id: string
}

interface Option {
  value: string
  label: string
  heat: number
}

export const TagSelect: React.FC<{
  tags: string[]
  setTags: (tags: string[]) => void
}> = ({ tags, setTags }) => {
  const [str, setStr] = useState('')
  const [isNewTag, setIsNewTag] = useState(false)
  const [options, setOptions] = useState<Option[]>([])

  const searchFn = async (str: string) => {
    const res = await queryTags(str)

    const options = res.map((t: Tag) => {
      return {
        value: t.name,
        label: t.name,
        heat: t.heat,
      }
    })
    setOptions(options.slice(0, 6))
    setIsNewTag(false)
    if (str && options.length < 3) {
      setIsNewTag(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 处理回车，空格，删除
    if (
      e.target.value.endsWith(' ') ||
      e.target.value.endsWith(',') ||
      e.target.value.endsWith('，')
    ) {
      if (isNewTag) {
        setTags([...tags, str])
        addTag(str)
      }
      setStr('')
      return
    }
    if (e.target.value.endsWith('Enter')) {
      setTags(tags.slice(0, -1))
      return
    }

    setStr(e.target.value)
    searchFn(e.target.value)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '8px 0',
        zIndex: 100,
        width: '100%',
      }}
    >
      <div
        style={{
          margin: '8px 0',
          color: 'var(--text-color)',
        }}
      >
        标签：
        {tags.map((t) => (
          <span
            style={{
              padding: '0 4px',
              margin: '0 4px',
              borderRadius: '4px',
              background: 'var(--bg-color-secondary)',
              color: 'var(--theme-color)',
              fontSize: '16px',
              cursor: 'pointer',
            }}
            key={t}
          >
            {t}
            <span
              onClick={() => {
                setTags(tags.filter((tag) => tag !== t))
              }}
            >
              ✖️
            </span>
          </span>
        ))}
      </div>
      <Dropdown
        Toggle={
          <input
            value={str}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '6px 10px',
              fontSize: '16px',
              borderRadius: '4px',
              boxSizing: 'border-box',
              outline: 'none',
              border: '1px solid var(--border-color)',
            }}
          />
        }
        Menu={
          <div
            style={{
              width: '100%',
              padding: '8px 0',
              background: 'var(--bg-color-secondary)',
              borderRadius: '4px',
              boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.1)',
              boxSizing: 'border-box',
              position: 'absolute',
              zIndex: 100,
            }}
          >
            {isNewTag && (
              <>
                <span style={{ color: 'var(--theme-color)' }}>{str}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    addTag(str)
                    setTags([...tags, str])
                    setStr('')
                  }}
                >
                  新建标签
                </button>
              </>
            )}

            {options.map((o) => (
              <div
                style={{
                  padding: '4px 10px',
                  fontSize: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  width: '100%',
                }}
                key={o.value}
                onClick={() => {
                  setTags([...tags, o.value])
                  setStr('')
                }}
              >
                {o.label + '(热度' + o.heat + ')'}{' '}
                {tags.includes(o.value) ? '✅' : ''}
              </div>
            ))}
          </div>
        }
      />
    </div>
  )
}
