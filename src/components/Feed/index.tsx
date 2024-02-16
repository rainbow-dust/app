import { FC, useEffect, useMemo, useRef, useState } from 'react'

import { rafThrottle } from '~/hooks/utils'
import { Note } from '~/services'

import { LazyLoading } from './LazyLoading'
import { NoteCell } from './NoteCell'

// interface NoteWithLayout extends Note {
//   layout: {
//     width: number
//     height: number
//     x: number
//     y: number
//   }
// }

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
  const [myNotes, setMyNotes] = useState<Note[]>(notes)
  useEffect(() => {
    // 这里不要直接 set... 如果可以的话，处理过后再塞进去，而不是塞进去让 一堆 memo 全都更新...
    setMyNotes(notes)
  }, [notes])

  const waterfallRef = useRef<HTMLDivElement>(null)

  const GAP_V = 10
  const GAP_H = 10
  const BOTTOM_GAP = 60 // 底部文字, actions 的留空
  const DEFAULT_WIDTH = 230 // 参考宽度

  const [scrollState, setScrollState] = useState({
    viewWidth: 0,
    viewHeight: 0,
    start: 0,
  })
  const end = useMemo(() => 500 + scrollState.start, [scrollState])

  const columnCount = useMemo(
    () => Math.max(Math.floor(scrollState.viewWidth / DEFAULT_WIDTH), 2),
    [scrollState],
  )

  const [totalHeight, setTotalHeight] = useState(0)

  const handleScroll = rafThrottle(() => {
    console.time('scroll')
    const { scrollTop } = waterfallRef.current!
    setScrollState({
      ...scrollState,
      start: scrollTop,
    })
    console.timeEnd('scroll')
    console.log(scrollState.start, scrollTop)
  })

  const notesWithSize = useMemo(() => {
    return myNotes.map((note) => {
      const width = scrollState.viewWidth / columnCount - GAP_H
      const height = note?.cover
        ? Math.max(
            Math.floor(note?.cover?.height * (width / note?.cover?.width)) +
              BOTTOM_GAP,
            200,
          )
        : 200
      return {
        ...note,
        layout: {
          width,
          height,
        },
      }
    })
  }, [myNotes])

  const notesWithLayout = useMemo(() => {
    const columnWidth = scrollState.viewWidth / columnCount
    const columnsHeight = new Array(columnCount).fill(0)
    const _notes = notesWithSize.map((note) => {
      const columnIndex = columnsHeight.indexOf(Math.min(...columnsHeight))
      const x = columnIndex * columnWidth + GAP_H / 2
      const y = columnsHeight[columnIndex] + GAP_V
      const layout = {
        ...note.layout,
        x,
        y,
      }
      columnsHeight[columnIndex] += layout.height + GAP_V
      return {
        ...note,
        layout,
      }
    })

    setTotalHeight(Math.max(...columnsHeight))
    return _notes
  }, [notesWithSize])

  const visibleNotes = useMemo(() => {
    return notesWithLayout.filter((note) => {
      const y = note.layout.y
      const h = note.layout.height
      return y < end && y + h > scrollState.start
    })
  }, [notesWithLayout, scrollState, end])

  const init = () => {
    setScrollState({
      viewWidth: waterfallRef.current!.clientWidth,
      viewHeight: waterfallRef.current!.clientHeight,
      start: waterfallRef.current!.scrollTop,
    })
  }

  useEffect(() => {
    init()
  }, [myNotes])

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        width: '100%',
        overflowY: 'scroll',
        height: '100vh',
      }}
      ref={waterfallRef}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {visibleNotes?.map((content) => (
          <div
            key={content._id}
            style={{
              position: 'absolute',
              width: content.layout.width,
              height: content.layout.height,
              transform: `translate(${content.layout.x}px, ${content.layout.y}px)`,
            }}
          >
            <NoteCell key={content._id} content={content} />
          </div>
        ))}
      </div>
      <LazyLoading
        isLoadingMore={options.isLoadingMore || options.isRefreshing}
        isReachingEnd={options.isReachingEnd}
        setSize={options.setSize}
        size={options.size}
      />
    </div>
  )
}
