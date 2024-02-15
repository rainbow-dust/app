import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { Message } from './components/Message/index.tsx'

import './index.css'

import FufuTracker from 'fufu-tracker'

const fufu = new FufuTracker({
  app_id: 'furina',
  username: localStorage.getItem('username') || 'anonymous',
  report_url: 'http://localhost:9527/statistics/collect',
  events_tobe_record: ['user_action'],
})
setInterval(() => {
  console.log('send')
  fufu.send()
}, 60000)
const originFetch = fetch
const checkStatus = (response: Response) => {
  fufu.pushEvent({
    type: 'request',
    data: {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
    },
  })

  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  throw error
}
Object.defineProperty(window, 'fetch', {
  configurable: true,
  enumerable: true,
  // writable: true,
  get() {
    return (url: string, options: RequestInit) => {
      return originFetch(url, {
        // 这里可以加些公共的东西，比如 token，然后后写的 options 会覆盖这些默认的
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        ...options,
      })
        .then(checkStatus)
        .catch((err) => {
          Message.error(err.message)
          console.log(err)
          throw err
        })
      // checkStatus 这里可以做返回错误处理，实现返回拦截
      // .then((response) => response.json())
    }
  },
})
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log('hello world', import.meta.env)
