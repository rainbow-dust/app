import { createContext, useState } from 'react'

interface CurrentUserContextType {
  user: {
    username: string
    token: string
  }
  setUser: (user: { username: string; token: string }) => void
}

export const CurrentUserContext = createContext<CurrentUserContextType>({
  user: {
    username: '',
    token: '',
  },
  setUser: () => {},
})

export const useCurrentUser = () => {
  const [user, setUser] = useState({
    username: localStorage.getItem('username') || '',
    token: localStorage.getItem('token') || '',
  })
  return { user, setUser }
}
