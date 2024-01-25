import './App.css'

import { RouterProvider } from 'react-router-dom'

import { router } from '~/router/router.ts'
import { getUnReadNoticeCount } from '~/services'

function App() {
  getUnReadNoticeCount()

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
