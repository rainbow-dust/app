import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

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
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: '#fff',
                  padding: '1em',
                  position: 'relative',
                }}
              >
                {children}
                <button
                  onClick={toggle}
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </>,
        document.body,
      )
    : null
}

export { useModal, Modal }
