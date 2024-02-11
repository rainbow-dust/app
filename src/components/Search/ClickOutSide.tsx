import React, { useEffect, useRef } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(
  ref: React.RefObject<HTMLElement>,
  onClickOutSide: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutSide()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClickOutSide])
}

/**
 * Component that alerts if you click outside of it
 */
export const ClickOutSide = (props: {
  children: React.ReactNode
  onClickOutSide: () => void
}) => {
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, props.onClickOutSide)

  return <div ref={wrapperRef}>{props.children}</div>
}
