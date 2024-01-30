import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Search } from '~/components/Search'
import { CurrentUserContext } from '~/hooks/useCurrentUser'
import { queryTags } from '~/services'

import { LoginOrRegisterModal } from '../Modal/LoginOrRegister'
import Classes from './index.module.css'

export const NavBar = () => {
  const navigate = useNavigate()
  // 登录
  const currentUser = useContext(CurrentUserContext)
  const logout = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    currentUser.setUser({
      username: '',
      token: '',
    })
  }
  const [isLoginOrRegisterModalOpen, setIsLoginOrRegisterModalOpen] =
    useState(false)
  const toggleLoginOrRegisterModal = () => {
    setIsLoginOrRegisterModalOpen(!isLoginOrRegisterModalOpen)
  }

  // 亮暗
  const [isDark, setIsDark] = useState(localStorage.getItem('isDark') === '')
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('dark', '')
    } else {
      document.documentElement.removeAttribute('dark')
    }
    localStorage.setItem('isDark', isDark.toString())
  }, [isDark])

  // 搜索
  const [str, setStr] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const searchFn = async (str: string) => {
    const res = await queryTags(str)

    const options = res.map((t: { name: string; _id: string }) => {
      return {
        value: t.name,
        label: t.name,
      }
    })
    return options
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
        <Search
          str={str}
          tags={tags}
          setStr={setStr}
          setTags={setTags}
          searchFn={searchFn}
        ></Search>
      </div>
      <div>
        {currentUser.user.username ? (
          <div>
            <span>{currentUser.user.username}</span>
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

      <div className={Classes['toggle-theme']}>
        {isDark ? (
          <button
            onClick={() => {
              setIsDark(false)
            }}
          >
            🌚
          </button>
        ) : (
          <button
            onClick={() => {
              setIsDark(true)
            }}
          >
            🌞
          </button>
        )}
      </div>
    </div>
  )
}
