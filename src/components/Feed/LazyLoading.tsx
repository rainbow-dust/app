import { FC, useCallback, useRef } from 'react'

import { IconLoading } from '../Icons'
import { IconEmpty } from '../Icons'

export const LazyLoading: FC<{
  isLoadingMore: boolean | undefined
  isReachingEnd: boolean | undefined
  setSize: (size: number) => void
  size: number
}> = ({ isLoadingMore, isReachingEnd, setSize, size }) => {
  const observer = useRef<IntersectionObserver>()
  const lazyLoadingRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingMore) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && !isReachingEnd) {
          setSize(size + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoadingMore, isReachingEnd, setSize, size],
  )
  return (
    <div
      ref={lazyLoadingRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {isLoadingMore ? <IconLoading /> : isReachingEnd ? <IconEmpty /> : null}
    </div>
  )
}
