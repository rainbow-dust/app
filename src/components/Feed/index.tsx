import { FC, useEffect, useRef, useState } from 'react'

import { Note } from '~/services'

import { LazyLoading } from './LazyLoading'
import { NoteCell } from './NoteCell'

interface NoteWithLayout extends Note {
  layout: {
    width: number
    height: number
    x?: number
    y?: number
  }
}

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
  // 在这里给 note 加上一个宽高...以及布局...这个应该是 Feed 的职责

  const [renderedNote, setRenderedNote] = useState<NoteWithLayout[]>([])
  const [totalHeight, setTotalHeight] = useState<number>(0)

  // 获取当前外层的宽度，然后计算出每个 note 的宽高，然后进行布局，用 useRef

  const ref = useRef<HTMLDivElement>(null)

  const GAP_V = 10
  const GAP_H = 10
  const BOTTOM_GAP = 60 // 底部文字, actions 的留空
  const DEFAULT_WIDTH = 230 // 参考宽度
  let columnHeight: number[]
  const getNotesWithLayout = (notes: Note[]) => {
    const notesWithLayout: NoteWithLayout[] = []
    // 参考宽度与ref宽度作比，给出一个列数
    const columnCount = Math.max(
      Math.floor((ref.current?.offsetWidth || 600) / DEFAULT_WIDTH),
      2,
    )
    columnHeight = Array(columnCount).fill(0)
    const width =
      (ref.current?.offsetWidth || 600) / columnCount -
      (GAP_H * (columnCount - 1)) / columnCount
    // 获取 note.cover 中的宽高，计算出 note 的高度后
    notes.forEach((note) => {
      const height =
        Math.max(
          Math.floor(note?.cover?.height * (width / note?.cover?.width)) +
            BOTTOM_GAP,
          200,
        ) || 100
      notesWithLayout.push({
        ...note,
        layout: {
          width,
          height,
        },
      })
    })
    // 进行布局，每次选择高度最小的列进行布局
    // 注意处理间距
    notesWithLayout.forEach((note) => {
      const minHeight = Math.min(...columnHeight)
      const index = columnHeight.indexOf(minHeight)
      note.layout.x = index * (width + GAP_H)
      note.layout.y = minHeight
      columnHeight[index] += note.layout.height + GAP_V
    })

    setTotalHeight(Math.max(...columnHeight))
    return notesWithLayout
  }

  // 我只能说 react 和 windowing 的结合真的很难搞
  // const getVisibleNotes = (notes: NoteWithLayout[], ranger:{
  //   top: number
  //   bottom: number
  // } = {
  //   top: window.scrollY,
  //   bottom: window.scrollY + window.innerHeight
  // }) => {
  //   return notes.filter((note) => {
  //     return (
  //       note.layout.y! + note.layout.height! > ranger.top &&
  //       note.layout.y! < ranger.bottom
  //     )
  //   })
  // }

  useEffect(() => {
    setRenderedNote(getNotesWithLayout(notes))
  }, [notes])

  return (
    <div style={{ fontFamily: 'sans-serif', width: '100%' }} ref={ref}>
      <div
        style={{
          height: totalHeight,
        }}
      >
        {renderedNote?.map((content) => (
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
