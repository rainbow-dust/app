import { Modal } from './base'
import Classes from './popup.module.css'

interface PopupProps {
  isOpen: boolean
  toggle: () => void
  children: React.ReactNode
}

export const Popup = ({ isOpen, toggle, children }: PopupProps) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <div
        className={Classes['popup']}
        // 有关动画这块...可以触发动画，然后在 onAnimationEnd 事件中关闭弹窗
      >
        {children}
      </div>
    </Modal>
  )
}
