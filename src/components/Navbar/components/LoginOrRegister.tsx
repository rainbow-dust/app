import { useContext, useState } from 'react'

import { Message } from '~/components/Message'
import { Modal } from '~/components/Modal'
import { CurrentUserContext } from '~/hooks/useCurrentUser'
import { login, register } from '~/services'

interface LoginOrRegisterProps {
  isOpen: boolean
  toggle: () => void
}

export const LoginOrRegisterModal = ({
  isOpen,
  toggle,
}: LoginOrRegisterProps) => {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <div
        style={{
          backgroundColor: 'var(--bg-color)',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 0 10px 0 var(--border-color)',
          position: 'relative',
        }}
      >
        <button
          onClick={() => {
            toggle()
          }}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            cursor: 'pointer',
          }}
        >
          关闭
        </button>

        {isLogin ? (
          <Login toggle={toggle} setIsLogin={setIsLogin} />
        ) : (
          <Register setIsLogin={setIsLogin} />
        )}
      </div>
    </Modal>
  )
}

const Login = ({
  toggle,
  setIsLogin,
}: {
  toggle: () => void
  setIsLogin: (isLogin: boolean) => void
}) => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const { setUser } = useContext(CurrentUserContext)

  const handleLogin = async () => {
    const res = await login(username, password)
    if (res?.username) {
      Message.success('登录成功')
      await localStorage.setItem('username', res.username)
      localStorage.setItem('token', res.token)
      toggle()
      setUser(res)
    } else {
      Message.error('登录失败' + JSON.stringify(res))
    }
  }

  return (
    <div>
      <div>
        <h3>登录</h3>
        <button
          onClick={() => {
            setIsLogin(false)
          }}
        >
          去注册
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
          }}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </div>
      <div>
        <button onClick={handleLogin}>登录</button>
      </div>
    </div>
  )
}

const Register = ({
  setIsLogin,
}: {
  setIsLogin: (isLogin: boolean) => void
}) => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleRegister = async () => {
    const res = await register(username, password)
    if (res?.username) {
      Message.success('注册成功')
      setIsLogin(true)
    } else {
      Message.error('注册失败' + JSON.stringify(res))
    }
  }

  return (
    <div>
      <div>
        <h3>注册</h3>
        <button
          onClick={() => {
            setIsLogin(true)
          }}
        >
          去登录
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
          }}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </div>
      <div>
        <button onClick={handleRegister}>注册</button>
      </div>
    </div>
  )
}
