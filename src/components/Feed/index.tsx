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

  const [notesWithLayout, setNotesWithLayout] = useState<NoteWithLayout[]>([])
  const [totalHeight, setTotalHeight] = useState<number>(0)

  // 获取当前外层的宽度，然后计算出每个 note 的宽高，然后进行布局，用 useRef

  const ref = useRef<HTMLDivElement>(null)

  let columnHeight: number[] = []
  const getNotesWithLayout = (notes: Note[]) => {
    const notesWithLayout: NoteWithLayout[] = []
    // 获取窗口宽度，除 3 后取整作为列宽
    const width = Math.floor((ref.current?.offsetWidth || 600) / 3)
    // 获取 note.cover 中的宽高，计算出 note 的高度
    notes.forEach((note) => {
      const height =
        Math.floor(note.cover?.height * (width / note.cover?.width)) || 200
      notesWithLayout.push({
        ...note,
        layout: {
          width: width,
          height: height || 200,
        },
      })
    })
    columnHeight = [0, 0, 0]
    // 进行布局，每次选择高度最小的列进行布局
    notesWithLayout.forEach((note) => {
      const minHeight = Math.min(...columnHeight)
      const minIndex = columnHeight.indexOf(minHeight)
      note.layout.x = minIndex * width
      note.layout.y = minHeight
      columnHeight[minIndex] += note.layout.height || 200
    })

    return notesWithLayout
  }

  // 监听 notes 的变化，重新计算布局
  useEffect(() => {
    setNotesWithLayout(getNotesWithLayout(notes))
    // console.log('notesWithLayout',notesWithLayout,columnHeight)
    setTotalHeight(Math.min(...columnHeight))
  }, [notes])

  return (
    <div style={{ fontFamily: 'sans-serif', width: '100%' }} ref={ref}>
      {options.isEmpty ? <p>Yay, no notes found.</p> : null}
      <div
        style={{
          height: totalHeight,
        }}
      >
        <ul>
          {notesWithLayout?.map((content) => (
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
        </ul>
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
