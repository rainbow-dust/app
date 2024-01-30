import { createContext, useEffect, useState } from 'react'

import { getUnReadNoticeCount } from '~/services'

interface NoticeContextType {
  count: number
  setCount: (count: number) => void
}

export const NoticeContext = createContext<NoticeContextType>({
  count: 0,
  setCount: () => {},
})

export const useNotice = () => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const mo = () => {
      if (localStorage.getItem('token')) {
        getUnReadNoticeCount().then((res) => setCount(res))
        console.log('useNotice')
      }
    }
    window.addEventListener('click', mo)
    return () => {
      window.removeEventListener('click', mo)
    }
  }, [])
  return { count, setCount }
}
