import React, { useCallback, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import useSWRInfinite from 'swr/infinite'

import { cancelLikeNote, getNotes, likeNote } from '~/services'

interface Note {
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

const Note: React.FC<{ content: Note }> = ({ content }) => {
  const [note, setNote] = React.useState<Note>(content)

  return (
    <li key={note._id}>
      <Link to={`/detail/${note._id}`} key={note._id}>
        <h6>{note.title}</h6>
      </Link>
      <div>{note.content}</div>

      <div>
        <Link to={`/people/${note?.author?.username} `}>
          <img
            style={{
              width: '24px',
              height: '24px',
            }}
            src={note.author?.avatar_url}
          ></img>
          <span style={{ color: '#999' }}>{note.author?.username}</span>
        </Link>
      </div>
      {note?.is_liked ? (
        <button
          onClick={async () => {
            const data = await cancelLikeNote(note._id)
            if (data.ok == 0) return
            setNote({
              ...data,
            })
          }}
        >
          {note?.like_count}
          取消点赞
        </button>
      ) : (
        <button
          onClick={async () => {
            const data = await likeNote(note._id)
            if (data.ok == 0) return
            setNote({
              ...data,
            })
          }}
        >
          {note?.like_count}
          点赞
        </button>
      )}
      {note?.tags?.map((tag) => (
        <span key={tag._id}>#{tag?.name} </span>
      ))}
      <hr />
    </li>
  )
}

export const Feed = () => {
  const location = useLocation()

  // 如果可能的话... 我想拆... 将数据请求/下拉触发/数据渲染 分开

  const [queryStr, setQueryStr] = React.useState('')
  const queryTags = () => queryStr.split(' ').filter((i) => i)

  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite<Note[]>(
      (index) => ['key-/note/query/list', index],
      ([, index]) =>
        getNotes({
          pageCurrent: (index as number) + 1,
          pageSize: PAGE_SIZE,
          tags: queryTags(),
        }),
    )

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
      <input
        value={queryStr}
        onChange={(e) => {
          setQueryStr(e.target.value)
        }}
      />
      <button
        onClick={() => {
          mutate()
        }}
      >
        filter
      </button>

      <Link to="/feed/123" state={{ previousLocation: location }}>
        Modal1
      </Link>

      <ul>
        {notes?.map((content) => (
          <Note key={content._id} content={content} />
        ))}
      </ul>

      <div ref={lazyLoadingRef}>
        {isLoadingMore || isRefreshing
          ? 'loading...'
          : isReachingEnd
          ? 'no more notes'
          : 'load more'}
      </div>
      <Outlet />
    </div>
  )
}
