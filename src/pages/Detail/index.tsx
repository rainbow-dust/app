import { createRef, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  ReplierContext,
  ReplierContextType,
  useReplier,
} from '~/hooks/useReplier'
import { addComment } from '~/services'

import { Comments } from './components/Comments'
import { Content } from './components/Content'
import { Replier } from './components/Interaction'

export const Detail = () => {
  const { id } = useParams()
  const replier = useReplier()
  const navigate = useNavigate()

  const { setReplier } = useContext(ReplierContext)
  const CommentsRef = createRef()

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
      CommentsRef.current?.unfoldReply(rootCommentId)
    } else {
      CommentsRef.current?.fetchRootComments(id as string)
    }
    setReplier({
      isActive: false,
      rootCommentId: undefined,
      noteId: '',
      meetionee: undefined,
    })
  }

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
          <Content noteId={id} />
          <hr />
          <h4>Comments</h4>
          <ReplierContext.Provider value={replier as ReplierContextType}>
            <Comments noteId={id} onRef={CommentsRef} />
            <Replier handleAddComment={handleAddComment} />
          </ReplierContext.Provider>
        </>
      )}
    </div>
  )
}
