import { useParams } from 'react-router-dom'
import useSWR from 'swr'

// import { getUserInfo } from '~/services'

interface UserInfo {
  username: string
  email: string
  phone: string
}

export const People = () => {
  const { username } = useParams<{ username: string }>()
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, error, isLoading } = useSWR<UserInfo>(
    `/api/user/${username}`,
    fetcher,
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  return <div>{JSON.stringify(data)}</div>
}
