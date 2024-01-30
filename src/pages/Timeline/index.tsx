import { useParams } from 'react-router-dom'

export const Timeline = () => {
  const { id } = useParams()

  return (
    <div>
      <h1
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {id}-Modal
      </h1>
    </div>
  )
}
