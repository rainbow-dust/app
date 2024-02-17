import React, { useState } from 'react'

import { ClickOutSideProvider } from '~/hooks/useClickOutSide'

import Classes from './index.module.css'

interface DropdownProps {
  Toggle: React.ReactNode | undefined
  Menu: React.ReactNode
}

export const Dropdown: React.FC<DropdownProps> = ({ Toggle, Menu }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <ClickOutSideProvider onClickOutSide={() => setIsOpen(false)}>
      <div className={Classes['dropdown']}>
        <div onClick={handleToggle}>{Toggle}</div>
        {isOpen && <div className={Classes['dropdown-menu']}>{Menu}</div>}
      </div>
    </ClickOutSideProvider>
  )
}
