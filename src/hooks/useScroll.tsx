import { RefObject, useEffect, useState } from 'react'

let lastScrollY = 0

export function useScroll(scrollRef: RefObject<HTMLDivElement> | null) {
  const [scroll, setScroll] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollDirection, setScrollDirection] = useState('down')
  const el = scrollRef?.current || window

  useEffect(() => {
    const handleScroll = () => {
      if (el) {
        const scrollY =
          el === window
            ? el.scrollY
            : el === scrollRef?.current
            ? el.scrollTop
            : 0
        setScroll(Number(scrollY.toFixed(0)))
        setIsScrolling(true)
        setScrollDirection(scrollY > lastScrollY ? 'down' : 'up')
        lastScrollY = scrollY
      }
    }

    if (el) {
      el.addEventListener('scroll', handleScroll)
      return () => {
        if (el) {
          el.removeEventListener('scroll', handleScroll)
        }
      }
    }
  }, [scrollRef, el])

  useEffect(() => {
    if (isScrolling) {
      setTimeout(() => {
        setIsScrolling(false)
      }, 66)
    }
  }, [isScrolling])

  return { scroll, isScrolling, scrollDirection }
}
