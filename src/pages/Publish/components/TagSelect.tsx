import { useState } from 'react'

import { Dropdown } from '~/components/Dropdown'
import { addTag, queryTags } from '~/services'

import Classes from './TagSelect.module.css'

interface Tag {
  name: string
  heat: number
  _id: string
}

interface Option {
  value: string
  label: string | React.ReactNode
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
        // label: ()=>{
        //   if(t.name.match(str)){
        //     return (
        //       <>
        //         {t.name.slice(0, t.name.indexOf(str))}
        //         <span style={{ color: 'var(--theme-color)' }}>{str}</span>
        //         {t.name.slice(t.name.indexOf(str) + str.length)}
        //       </>
        //     )
        //   }
        // },
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
    <div className={Classes['tag-select']}>
      <div
        style={{
          margin: '8px 0',
          color: 'var(--text-color)',
        }}
      >
        标签：
        {tags.map((t) => (
          <span className={Classes['tag']} key={t}>
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
            className={Classes['input']}
          />
        }
        Menu={
          <div className={Classes['menu']}>
            {isNewTag && (
              <span className={Classes['option']}>
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
              </span>
            )}

            {options.map((o) => (
              <div
                className={Classes['option']}
                key={o.value}
                onClick={() => {
                  setTags([...tags, o.value])
                  setStr('')
                }}
              >
                {o.label + '(热度' + o.heat + ')'}
                {tags.includes(o.value) ? '✅' : ''}
              </div>
            ))}
          </div>
        }
      />
    </div>
  )
}
