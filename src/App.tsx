import './App.css'

import { InputTag } from '@/components/InputTag'
import { useScroll } from '@/hooks/useScroll'

import { Router } from './router/router'

function App() {
  const scrollRef = null
  const scroll = useScroll(scrollRef)
  return (
    <>
      <div className="app">
        <div className={scroll.scrollDirection === 'up' ? 'bar' : 'bar hide'}>
          <InputTag></InputTag>
          <br />
          <br />
          <br />
          {JSON.stringify(scroll)}
        </div>
        <div style={{ marginTop: '50px' }}>
          <Router></Router>
        </div>
      </div>
    </>
  )
}

export default App
