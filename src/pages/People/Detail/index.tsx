import { useParams } from 'react-router-dom'

import { BaseInfo } from './BaseInfo'
import { RelatedNotes } from './RelatedNotes'

export const PeopleDetail = () => {
  const { username } = useParams<{ username: string }>()
  return (
    <div>
      <BaseInfo username={username as string} />
      <hr />
      <div>
        <RelatedNotes username={username as string} />
      </div>
    </div>
  )
}
