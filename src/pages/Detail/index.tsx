import { useNavigate, useParams } from 'react-router-dom'

import {
  ReplierContext,
  ReplierContextType,
  useReplier,
} from '~/hooks/useReplier'

import { Comments } from './components/Comments'
import { Content } from './components/Content'

export const Detail = () => {
  const { id } = useParams()
  const replier = useReplier()
  const navigate = useNavigate()
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white',
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
          >
            Back
          </button>
          <Content noteId={id} />
          <h3>Comments</h3>
          <ReplierContext.Provider value={replier as ReplierContextType}>
            <Comments noteId={id} />
          </ReplierContext.Provider>
        </>
      )}
    </div>
  )
}
