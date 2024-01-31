import { FC, useCallback, useRef } from 'react'

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
    <div ref={lazyLoadingRef}>
      {isLoadingMore ? (
        <div>Loading...</div>
      ) : isReachingEnd ? (
        <div>End</div>
      ) : null}
    </div>
  )
}
