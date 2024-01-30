import { useParams } from 'react-router-dom'

import { Comments } from './components/Comments'
import { Content } from './components/Content'

export const Detail = () => {
  const { id } = useParams()
  return (
    <div>
      {id && (
        <>
          <Content noteId={id} />
          <h3>Comments</h3>
          <Comments noteId={id} />
        </>
      )}
    </div>
  )
}
