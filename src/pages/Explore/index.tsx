import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import useSWRInfinite from 'swr/infinite'

import { Feed } from '~/components/Feed'
import { Note, getNotes } from '~/services'

// 哪些应该放在这里？

// 请求数据的逻辑
// 不对...tmd.. 跳转和连续/持久化数据流，是不是俩相矛盾的东西啊...
const PAGE_SIZE = 10

export const Explore = () => {
  const [queryStr, setQueryStr] = useState('')
  const queryTags = () => queryStr.split(' ').filter((i) => i)

  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite<Note[]>(
      (index: number) => ['key-/note/query/list', index],
      ([, index]: [string, number]) =>
        getNotes({
          pageCurrent: (index as number) + 1,
          pageSize: PAGE_SIZE,
          tags: queryTags(),
        }),
    )

  console.log('data', data, mutate)

  const notes: Note[] = data ? data.flat() : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  return (
    <div>
      <Link to="/explore/123">123Modal</Link>
      <input
        value={queryStr}
        onChange={(e) => {
          setQueryStr(e.target.value)
        }}
      />

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
      <Outlet />
    </div>
  )
}
