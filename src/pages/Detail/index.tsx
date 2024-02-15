import { createRef, useContext } from 'react'
import { BsChatDots } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { IconCollect, IconLike } from '~/components/Icons'
import { Popup } from '~/components/Modal'
import { useModal } from '~/components/Modal/base'
import { getDate } from '~/hooks/useDate'
import {
  ReplierContext,
  ReplierContextType,
  useReplier,
} from '~/hooks/useReplier'
import { CollectList } from '~/pages/Collect/components'
import { addComment, cancelLikeNote, getNote, likeNote } from '~/services'
import type { Note } from '~/services'

import { Comments, CommentsRef } from './components/Comments'
import { Author, NoteText, Pics } from './components/Content'
import { Interactions } from './components/Interactions'

export const Detail = () => {
  const { id } = useParams()
  const replier = useReplier()
  const navigate = useNavigate()

  const { data: note, mutate: mutateNote } = useSWR<Note>(
    ['key-/note/query/detail', id],
    () => getNote(id as string),
  )

  // 评论回复相关
  const { setReplier } = useContext(ReplierContext)
  const CommentsRef = createRef<CommentsRef>()

  const handleAddComment = async (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => {
    await addComment({
      content,
      note_id: id as string,
      root_comment_id: rootCommentId,
      mentionee_id: meetioneeId,
    })

    if (rootCommentId) {
      CommentsRef.current!.unfoldReply(rootCommentId)
    } else {
      CommentsRef.current!.fetchRootComments(id as string)
    }
    setReplier({
      isActive: false,
      rootCommentId: undefined,
      noteId: '',
      meetionee: undefined,
    })
  }
  const { isOpen, toggle } = useModal()

  if (!id) return <div>note not found...</div>

  if (!note) return <div>loading...</div>

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-color)',
        padding: '20px 0 100px 0',
        overflowY: 'scroll',
        zIndex: 100,
      }}
    >
      <>
        <button
          onClick={() => {
            navigate(-1)
          }}
          style={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: 100,
          }}
        >
          Back←
        </button>
        <div
          className="content"
          style={{
            margin: '0 20px',
          }}
        >
          <Author author={note.author} />
          <Pics pic_list={note.pic_list} />
          <NoteText
            title={note.title}
            content={note.content}
            tags={note.tags}
          />
          <div
            style={{
              color: 'var(--text-color-secondary)',
              margin: '10px 0',
            }}
          >
            {/* es-lint 报错纯看命名的吗... */}
            {getDate(note.created_at)}
          </div>
        </div>
        <hr />
        <ReplierContext.Provider value={replier as ReplierContextType}>
          <div
            style={{
              margin: '0 20px',
            }}
          >
            <Comments noteId={id} onRef={CommentsRef} />
          </div>
          <Interactions
            handleAddComment={handleAddComment}
            Like={() => {
              return (
                <>
                  <IconLike
                    isLiked={note?.is_liked || false}
                    handleLike={async () => {
                      await likeNote(note._id)
                      mutateNote()
                    }}
                    handleCancelLike={async () => {
                      await cancelLikeNote(note._id)
                      mutateNote()
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      margin: '0 4px',
                    }}
                  >
                    {note?.like_count}
                  </span>
                </>
              )
            }}
            Collect={() => {
              return (
                <>
                  <IconCollect
                    isCollected={true}
                    handleCollect={async () => {
                      // await likeNote(note._id)
                      // mutateNote()
                    }}
                    handleCancelCollect={async () => {
                      toggle()
                      console.log('toggle')
                      // await cancelLikeNote(note._id)
                      // mutateNote()
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      margin: '0 4px',
                    }}
                  >
                    {note?.collect_count}
                  </span>
                </>
              )
            }}
            Comment={() => {
              return (
                <>
                  <BsChatDots
                    style={{
                      verticalAlign: 'middle',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setReplier({
                        isActive: true,
                        rootCommentId: undefined,
                        noteId: id as string,
                        meetionee: undefined,
                      })
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      margin: '0 4px',
                    }}
                  >
                    {note?.comment_count}
                  </span>
                </>
              )
            }}
          />
        </ReplierContext.Provider>
      </>
      <Popup
        isOpen={isOpen}
        toggle={toggle}
        children={<CollectList noteId={id as string} />}
      />
    </div>
  )
}
