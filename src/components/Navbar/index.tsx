import { useContext, useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

import { Dropdown } from '~/components/Dropdown'
import { Search } from '~/components/Search'
import { CurrentUserContext } from '~/hooks/useCurrentUser'
import { queryTags } from '~/services'

import { useModal } from '../Modal/base'
import { LoginOrRegisterModal } from './components/LoginOrRegister'
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

  const { isOpen, toggle } = useModal()
  // 亮暗
  type Theme = 'light' | 'dark' | 'system' | null
  const [theme, setTheme] = useState<Theme>(
    localStorage.getItem('theme') as Theme,
  )
  useEffect(() => {
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      if (media.matches) {
        setTheme('dark')
      } else {
        setTheme('light')
      }
    } else if (theme === 'dark') {
      document.documentElement.setAttribute('dark', '')
    } else {
      document.documentElement.removeAttribute('dark')
    }
  }, [theme])

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
    <div className={Classes.navbar}>
      <div
        onClick={() => {
          navigate('/')
        }}
      >
        <img
          src="/logo.png"
          alt="logo"
          style={{
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            marginRight: '10px',
            verticalAlign: 'middle',
          }}
        />
        furina
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Search
          str={str}
          tags={tags}
          setStr={setStr}
          setTags={setTags}
          searchFn={searchFn}
        ></Search>
        <BsSearch
          style={{
            verticalAlign: 'middle',
            marginLeft: '10px',
            cursor: 'pointer',
          }}
          onClick={() => {
            navigate(`/search/${str}`)
          }}
        />
      </div>

      <div
        className={Classes['menu']}
        style={{
          position: 'relative',
        }}
      >
        {/* ...local上再多存点东西...头像也要 */}
        <Dropdown
          Toggle={<button>☰</button>}
          Menu={
            <>
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
                  <button onClick={toggle}>登录</button>
                )}
              </div>

              <div className={Classes['toggle-theme']}>
                {theme === 'dark' ? (
                  <button
                    onClick={() => {
                      setTheme('light')
                      localStorage.setItem('theme', 'light')
                    }}
                  >
                    🌚
                  </button>
                ) : theme === 'light' ? (
                  <button
                    onClick={() => {
                      setTheme('dark')
                      localStorage.setItem('theme', 'dark')
                    }}
                  >
                    🌞
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTheme('system')
                      localStorage.setItem('theme', 'system')
                    }}
                  >
                    🌞🌚
                  </button>
                )}
              </div>
            </>
          }
        />
      </div>

      <LoginOrRegisterModal isOpen={isOpen} toggle={toggle} />
    </div>
  )
}
