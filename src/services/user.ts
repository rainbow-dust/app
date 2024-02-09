import { BASE_URL } from './index'

export async function register(username: string, password: string) {
  return fetch(`${BASE_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
      if (res.error) throw res.error
      // 储存 bearer token...????为什么这边写的不执行？？？
      localStorage.setItem('token', res.token)
      return res
    })
}

export async function login(username: string, password: string) {
  return fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function follow(username: string) {
  return fetch(`${BASE_URL}/user/follow/${username}`, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function cancelFollow(username: string) {
  return fetch(`${BASE_URL}/user/follow/${username}`, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}
