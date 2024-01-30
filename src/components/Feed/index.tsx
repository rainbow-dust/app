import { FC, useCallback, useRef } from 'react'
import useSWRInfinite from 'swr/infinite'

import { NoteCell } from './NoteCell'

export interface Note {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    username: string
    avatar_url: string
  }
  tags: {
    _id: string
    name: string
  }[]
  like_count: number
  is_liked: boolean
}

const PAGE_SIZE = 10

export const Feed: FC<{
  swrOp: {
    key: (index: number) => Array<string | number>
    fetcher: ([string, number]: [string, number]) => Promise<Note[]>
  }
}> = ({ swrOp }) => {
  // 如果可能的话... 我想拆... 将数据请求/下拉触发/数据渲染 分开

  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite<Note[]>(swrOp.key, swrOp.fetcher)

  const notes: Note[] = data ? data.flat() : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  const observer = useRef<IntersectionObserver>()
  const lazyLoadingRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingMore) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && !isReachingEnd) {
          setSize(size + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoadingMore, isReachingEnd, setSize, size],
  )
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {isEmpty ? <p>Yay, no notes found.</p> : null}
      <button
        onClick={() => {
          mutate()
        }}
      >
        filter
      </button>

      <ul>
        {notes?.map((content) => (
          <NoteCell key={content._id} content={content} />
        ))}
      </ul>

      <div ref={lazyLoadingRef}>
        {isLoadingMore || isRefreshing
          ? 'loading...'
          : isReachingEnd
          ? 'no more notes'
          : 'load more'}
      </div>
    </div>
  )
}
