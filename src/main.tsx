// import FufuTracker from 'fufu-tracker'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'

import './index.css'

// const fufu = new FufuTracker({
//   appId: 'furina',
//   reportUrl: 'http://localhost:9527/ping',
//   eventsTobeRecord: ['action_scroll', 'action_click'],
// })
// setInterval(() => {
//   fufu.send()
// }, 10000)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log('hello world', import.meta.env)
