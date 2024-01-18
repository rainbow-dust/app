import { useState } from 'react'

import { login, register } from '~/services'

import { Modal } from './base'

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
      {isLogin ? (
        <Login toggle={toggle} setIsLogin={setIsLogin} />
      ) : (
        <Register setIsLogin={setIsLogin} />
      )}
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

  const handleLogin = async () => {
    const res = await login(username, password)
    localStorage.setItem('username', res.username)
    localStorage.setItem('token', res.token)
    window.alert('登录成功')
    if (res) {
      toggle()
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
      window.alert('注册成功')
      setIsLogin(true)
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
