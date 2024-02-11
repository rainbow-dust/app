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
        getUnReadNoticeCount().then((res) => {
          setCount(res)
          if (res) {
            window.document.title = `(${res}) 小猫喵喵喵`
          } else {
            window.document.title = `小猫喵喵喵`
          }
        })
      }
    }
    window.addEventListener('click', debounce(mo, 1000))
    return () => {
      window.removeEventListener('click', debounce(mo, 1000))
    }
  }, [])
  return { count, setCount }
}

function debounce(fn: () => void, delay: number) {
  let timer: number
  return function () {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn()
    }, delay)
  }
}
