import { useParams } from 'react-router-dom'

import { ReplierContext, useReplier } from '~/hooks/useReplier'

import { Comments } from './components/Comments'
import { Content } from './components/Content'

export const Detail = () => {
  const { id } = useParams()
  const replier = useReplier()
  return (
    <div>
      {id && (
        <>
          <Content noteId={id} />
          <h3>Comments</h3>
          <ReplierContext.Provider value={replier}>
            <Comments noteId={id} />
          </ReplierContext.Provider>
        </>
      )}
    </div>
  )
}
