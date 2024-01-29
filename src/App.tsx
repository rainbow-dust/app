import './App.css'

import { RouterProvider } from 'react-router-dom'

import { CurrentUserContext, useCurrentUser } from '~/hooks/useCurrentUser'
import { router } from '~/router/router.ts'
import { getUnReadNoticeCount } from '~/services'

function App() {
  getUnReadNoticeCount()
  return (
    <>
      <CurrentUserContext.Provider value={useCurrentUser()}>
        <RouterProvider router={router} />
      </CurrentUserContext.Provider>
    </>
  )
}

export default App
