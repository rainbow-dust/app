import './App.css'

import { BottomMenu } from '~/components/BottomMenu'
import { NavBar } from '~/components/Navbar'
import { Router } from '~/router/router'
import { getUnReadNoticeCount } from '~/services'

function App() {
  getUnReadNoticeCount()

  return (
    <>
      <NavBar></NavBar>
      <div
        style={{
          padding: '3.5rem',
        }}
      >
        <Router></Router>
      </div>
      <BottomMenu></BottomMenu>
    </>
  )
}

export default App
