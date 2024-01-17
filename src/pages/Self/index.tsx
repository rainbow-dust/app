import React, { useState } from 'react'

import { login, register } from '~/services'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Handle login logic here

    login(username, password).then((res) => {
      if (!res.token) {
        window.alert(JSON.stringify(res))
        return
      }
      localStorage.setItem('token', res.token)
      localStorage.setItem('username', res.username)
      window.alert('登录成功')
      window.location.reload()
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

const RegistrationPage: React.FC = () => {
  const [username, setUsername] = useState('')
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const handleRegistration = () => {
    // Handle registration logic here
    register(username, password)
  }

  return (
    <div>
      <h1>Registration</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegistration}>Register</button>
    </div>
  )
}

const SelfPage: React.FC = () => {
  return (
    <div>
      {localStorage.getItem('token') ? (
        <h2>hi, {localStorage.getItem('username')}</h2>
      ) : (
        '-'
      )}
      <LoginPage />
      <RegistrationPage />
    </div>
  )
}

export const Self = SelfPage
