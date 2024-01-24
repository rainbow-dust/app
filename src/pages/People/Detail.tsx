import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

interface UserInfo {
  username: string
  avatar_url: string
  password: string
  bio: string
}

interface NoteData {
  noteList: {
    _id: string
    title: string
    content: string
  }[]
}

export const PeopleDetail = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((res) => res.json())

  const { data, error, isLoading } = useSWR<UserInfo>(
    `/api/user/${username}`,
    fetcher,
  )

  const {
    data: creations,
    error: creationsError,
    isLoading: creationsLoading,
  } = useSWR<NoteData>(`/api/note/query/list`, (url: string) =>
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        username: username,
        pageCurrent: 1,
        pageSize: 100,
      }),
    }).then((res) => res.json()),
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  return (
    <div>
      <h1>Info</h1>
      <div
        className="people-info
      border-b border-gray-200
      pb-4
      mb-4
      flex
      flex-col
      items-center
      justify-center

      
      "
      >
        <div
          className="people-avatar
        w-24
        h-24
        rounded-full
        overflow-hidden
        mb-4
        
        
        "
        >
          <img
            className="w-full h-full object-cover"
            src={data?.avatar_url}
            alt={data?.username}
          />
        </div>
        <div
          className="people-name
        font-bold
        text-lg
        mb-2
        
        
        "
        >
          {data?.username}
        </div>
        <div
          className="people-bio
        text-gray-500
        text-sm
        mb-2
        
        "
        >
          {data?.bio}
        </div>
      </div>
      {username === localStorage.getItem('username') && (
        <button
          onClick={() => {
            navigate(`/people/edit`)
          }}
        >
          go to edit
        </button>
      )}
      <div className="people-creations">
        <h2>Creations</h2>
        {creationsLoading && <div>Loading...</div>}
        {creationsError && <div>Error</div>}
        {creations?.noteList?.map((item) => (
          <div
            key={item._id}
            className="creation-item
          border-b border-gray-200
          pb-4
          mb-4
          flex
          flex-col
          items-start
          justify-center
          
          
          "
          >
            <div
              className="creation-title
            font-bold
            text-lg
            mb-2
            
            
            "
            >
              {item.title}
            </div>
            <div
              className="creation-content
            text-gray-500
            text-sm
            mb-2
            
            
            "
            >
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
