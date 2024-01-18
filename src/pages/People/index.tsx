import { useParams } from 'react-router-dom'

export const People = () => {
  const { username } = useParams<{ username: string }>()

  return (
    <div>
      <h1>People</h1>
      <p>hi, {username}</p>
    </div>
  )
}
