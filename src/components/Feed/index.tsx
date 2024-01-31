import { FC } from 'react'

import { Note } from '~/services'

import { LazyLoading } from './LazyLoading'
import { NoteCell } from './NoteCell'

export const Feed: FC<{
  notes: Note[]
  options: {
    isEmpty: boolean | undefined
    isReachingEnd: boolean | undefined
    isRefreshing: boolean | undefined
    isLoadingMore: boolean | undefined
    setSize: (size: number) => void
    size: number
  }
}> = ({ notes, options }) => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {options.isEmpty ? <p>Yay, no notes found.</p> : null}
      <ul>
        {notes?.map((content) => (
          <NoteCell key={content._id} content={content} />
        ))}
      </ul>
      <LazyLoading
        isLoadingMore={options.isLoadingMore || options.isRefreshing}
        isReachingEnd={options.isReachingEnd}
        setSize={options.setSize}
        size={options.size}
      />
    </div>
  )
}
