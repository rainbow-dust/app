import React, { useEffect, useRef } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(
  ref: React.RefObject<HTMLDivElement>,
  onClickOutSide: () => void,
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutSide()
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
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
