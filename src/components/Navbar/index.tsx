import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Search } from '~/components/Search'

import { LoginOrRegisterModal } from '../Modal/LoginOrRegister'
import Classes from './index.module.css'

export const NavBar = () => {
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    setUsername('')
  }

  const [isLoginOrRegisterModalOpen, setIsLoginOrRegisterModalOpen] =
    useState(false)
  const toggleLoginOrRegisterModal = () => {
    setIsLoginOrRegisterModalOpen(!isLoginOrRegisterModalOpen)
  }

  return (
    // <div className="fixed w-full bg-white z-10 shadow-sm">
    //   <div className="py-4 border-b-[1px]">barbar</div>
    // </div>
    <div className={Classes.navbar}>
      <div
        onClick={() => {
          navigate('/')
        }}
      >
        barbar
      </div>
      <div>
        <Search></Search>
      </div>
      <div>
        {username ? (
          <div>
            <span>{username}</span>
            <button
              onClick={() => {
                logout()
              }}
            >
              退出登录
            </button>
          </div>
        ) : (
          <button onClick={toggleLoginOrRegisterModal}>登录</button>
        )}
      </div>
      <LoginOrRegisterModal
        isOpen={isLoginOrRegisterModalOpen}
        toggle={toggleLoginOrRegisterModal}
      />
    </div>
  )
}
