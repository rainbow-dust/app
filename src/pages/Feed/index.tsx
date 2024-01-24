import React, { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
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

export const Feed = () => {
  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite<Note[]>(
      (index) => ['key-/note/query/list', index],
      ([, index]) => getNotes({ pageCurrent: index + 1, pageSize: PAGE_SIZE }),
    )

  const notes: Note[] = data ? [].concat(...data) : []
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
      <ul>
        {notes?.map((content) => (
          <li key={content._id}>
            <Link to={`/detail/${content._id}`} key={content._id}>
              <h6>{content.title}</h6>
            </Link>
            <div>{content.content}</div>

            <div>
              <Link to={`/people/${content?.author?.username} `}>
                <img
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                  src={content.author?.avatar_url}
                ></img>
                <span style={{ color: '#999' }}>
                  {content.author?.username}
                </span>
              </Link>
            </div>
            {content?.is_liked ? (
              <button
                onClick={async () => {
                  await cancelLikeNote(content._id)
                  mutate() // mutate() 会触发重新请求数据...但是感觉不应该因为点赞就重新请求数据吧...
                }}
              >
                {content?.like_count}
                取消点赞
              </button>
            ) : (
              <button
                onClick={async () => {
                  await likeNote(content._id)
                  mutate()
                }}
              >
                {content?.like_count}
                点赞
              </button>
            )}
            {content?.tags?.map((tag) => (
              <span key={tag._id}>#{tag?.name} </span>
            ))}
            <hr />
          </li>
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
