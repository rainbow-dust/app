import { createRef, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { IconLike } from '~/components/Icons'
import {
  ReplierContext,
  ReplierContextType,
  useReplier,
} from '~/hooks/useReplier'
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
      {id && (
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
          <div className="content">
            <Author author={note?.author} />
            <Pics pic_list={note?.pic_list} />
            <NoteText
              title={note?.title}
              content={note?.content}
              tags={note?.tags}
            />
          </div>
          <hr />
          <h4>Comments</h4>
          <ReplierContext.Provider value={replier as ReplierContextType}>
            <Comments noteId={id} onRef={CommentsRef} />
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
                    {note?.like_count}
                  </>
                )
              }}
              Collect={() => <div>collect</div>}
            />
          </ReplierContext.Provider>
        </>
      )}
    </div>
  )
}
