import React, { useEffect, useRef } from 'react'

function useOutside(
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

export const ClickOutSideProvider = (props: {
  children: React.ReactNode
  onClickOutSide: () => void
}) => {
  const wrapperRef = useRef(null)
  useOutside(wrapperRef, props.onClickOutSide)

  return <div ref={wrapperRef}>{props.children}</div>
}
