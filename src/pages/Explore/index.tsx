// import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import useSWRInfinite from 'swr/infinite'

import { Feed } from '~/components/Feed'
import { Note, getNotes, getRecommendNotes } from '~/services'

import './index.module.css'

const PAGE_SIZE = 10

export const Explore = () => {
  // const [queryStr, setQueryStr] = useState('')
  // const queryTags = () => queryStr.split(' ').filter((i) => i)

  const { data, size, setSize, isValidating, isLoading } = useSWRInfinite<
    Note[]
  >(
    (index: number) => ['key-/note/query/list', index],
    ([, index]: [string, number]) =>
      getNotes({
        pageCurrent: (index as number) + 1,
        pageSize: PAGE_SIZE,
        // tags: queryTags(),
      }),
  )

  const notes: Note[] = data ? data.flat() : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  // 想给 outlet 加上一个动画。。。

  return (
    <div>
      <button
        onClick={() => {
          getRecommendNotes({ pageCurrent: 1, pageSize: 10 }).then((res) => {
            console.log(res)
          })
        }}
      >
        test
      </button>
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
