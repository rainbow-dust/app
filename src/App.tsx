import './App.css'

import { RouterProvider } from 'react-router-dom'

import { CurrentUserContext, useCurrentUser } from '~/hooks/useCurrentUser'
import { NoticeContext, useNotice } from '~/hooks/useNotice'
import { router } from '~/router/router'

function App() {
  return (
    <>
      <NoticeContext.Provider value={useNotice()}>
        <CurrentUserContext.Provider value={useCurrentUser()}>
          <RouterProvider router={router} />
        </CurrentUserContext.Provider>
      </NoticeContext.Provider>
    </>
  )
}

export default App
