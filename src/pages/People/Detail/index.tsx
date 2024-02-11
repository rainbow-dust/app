import { useParams } from 'react-router-dom'

import { BaseInfo } from './BaseInfo'
import Classes from './Detail.module.css'
import { RelatedNotes } from './RelatedNotes'

export const PeopleDetail = () => {
  const { username } = useParams<{ username: string }>()
  return (
    <div>
      <BaseInfo username={username as string} />
      <hr />
      <div className={Classes['people-creations']}>
        <RelatedNotes username={username as string} />
      </div>
    </div>
  )
}
