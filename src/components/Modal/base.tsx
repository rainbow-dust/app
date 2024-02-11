import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import Classes from './base.module.css'

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  function toggle() {
    setIsOpen(!isOpen)
  }

  return {
    isOpen,
    toggle,
  }
}

interface ModalProps {
  isOpen: boolean
  toggle: () => void
  children: React.ReactNode
}

const Modal = ({ isOpen, toggle, children }: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  return isMounted
    ? ReactDOM.createPortal(
        <>
          {isOpen && (
            <div
              className={Classes['modal']}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  toggle()
                }
              }}
            >
              {children}
            </div>
          )}
        </>,
        document.body,
      )
    : null
}

export { useModal, Modal }
