import { useParams } from 'react-router-dom'

export const Detail = () => {
  const { id } = useParams()
  return (
    <div>
      <h1>Detail</h1>
      {id}
    </div>
  )
}
