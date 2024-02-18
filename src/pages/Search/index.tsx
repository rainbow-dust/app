// 展示搜索结果的页面

// pixiv 的搜索...突然那种模式感觉好烂... 功能很难加。
// 标签，搜索模式，确实，应该放到搜索页面内部去做

// 所以那个所谓的 tag input...简直就是神经病

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { Feed } from '~/components/Feed'
import { Tabs, useTabs } from '~/components/Tabs'
import { Tag } from '~/components/Tag'
import { Note, getNotes, queryTags } from '~/services'

interface Tag {
  id: number
  name: string
}

const PAGE_SIZE = 10

export const Search = () => {
  const [serachParams] = useSearchParams()
  const keyword = serachParams.get('keyword')

  const { data: tags, mutate: mutateTags } = useSWR<Tag[]>(
    () => ['tags', keyword],
    () => queryTags(keyword || ''),
  )
  useEffect(() => {
    mutateTags()
  }, [keyword])

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data, size, setSize, isValidating, isLoading, mutate } =
    useSWRInfinite<Note[]>(
      (index: number) => ['key-/note/query/list', index],
      ([, index]: [string, number]) =>
        getNotes({
          pageCurrent: (index as number) + 1,
          pageSize: PAGE_SIZE,
          tags: selectedTags,
        }),
    )
  const notes: Note[] = data ? data.flat() : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size
  useEffect(() => {
    mutate()
  }, [selectedTags])

  const searchModes = [
    {
      id: 'creations',
      label: '作品',
      content: <div>作品</div>,
    },
    {
      id: 'user',
      label: '用户',
      content: <div>用户</div>,
    },
  ]

  const { activeTab, setActiveTab } = useTabs('creations')

  // const [searchMode, setSearchMode] = useState('tag');
  // const [activeTags, setActiveTags] = useState([]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Tabs
        tabs={searchModes}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div
        style={{
          // 我希望下面的 tags 不会换行，也不会撑开父容器宽度。而是横向滚动， Tag 组件的 display 已经是 inline-block

          width: '100%',
          overflowX: 'auto',
          whiteSpace: 'nowrap',

          // 美化滚动条

          // 以下是一些滚动条的美化
          // 滚动条宽度
          scrollbarWidth: 'thin',
          // 滚动条颜色
          scrollbarColor: 'var(--theme-color) var(--bg-color)',
          boxSizing: 'border-box',
        }}
      >
        {tags?.map((tag) => (
          <Tag
            key={tag.id}
            name={tag.name}
            onClick={() => {
              if (selectedTags.includes(tag.name)) {
                setSelectedTags(selectedTags.filter((i) => i !== tag.name))
              } else {
                setSelectedTags([...selectedTags, tag.name])
              }
              console.log(selectedTags)
            }}
            active={selectedTags.includes(tag.name)}
          />
        ))}
      </div>
      <Feed
        notes={notes}
        options={{
          isEmpty,
          isReachingEnd,
          isRefreshing,
          isLoadingMore,
          setSize,
          size,
        }}
      />
    </div>
  )
}
