import { Link } from 'react-router-dom'

export const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <div>
        <Link to="/feed">Feed</Link>
      </div>
      <div>
        <Link to="/self">Self</Link>
      </div>
      <div>
        <Link to="/publish">Publish</Link>
      </div>
    </div>
  )
}
