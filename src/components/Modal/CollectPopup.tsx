import Classes from './CollectPopup.module.css'
import { Modal } from './base'

interface CollectPopupProps {
  isOpen: boolean
  toggle: () => void
  children: React.ReactNode
}

export const CollectPopup = ({
  isOpen,
  toggle,
  children,
}: CollectPopupProps) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <div
        className={Classes['collect-popup']}
        // 有关动画这块...可以触发动画，然后在 onAnimationEnd 事件中关闭弹窗
      >
        <h3>CollectPopup</h3>
        {children}
      </div>
    </Modal>
  )
}
