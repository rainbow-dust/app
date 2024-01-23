import { FC, useCallback, useRef, useState } from 'react'

interface Note {
  id: number
  content: string
}

const Cell: FC<{ note: Note }> = ({ note }) => {
  return <div>{note.content}</div>
}

export const Feed: FC<{
  initNoteList: Note[]
  loadMore: () => Promise<Note[]>
}> = ({ initNoteList, loadMore }) => {
  const [noteList, setNoteList] = useState(initNoteList)
  const [loading, setLoading] = useState(false)
  const [hasMore] = useState(true)

  const observer = useRef<IntersectionObserver>()
  const lastNoteElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true)
          const newNoteList = await loadMore()
          setNoteList((prevNoteList) => [...prevNoteList, ...newNoteList])
          setLoading(false)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore, loadMore],
  )

  return (
    <div className="feed">
      {noteList.map((note, index) => {
        if (noteList.length === index + 1) {
          return (
            <div ref={lastNoteElementRef} key={note.id}>
              {note.content}
            </div>
          )
        } else {
          return <Cell note={note} key={note.id} />
        }
      })}
      {loading && <div>Loading...</div>}
    </div>
  )
}
