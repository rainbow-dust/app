import { Outlet } from 'react-router-dom'

import { BottomMenu } from '~/components/BottomMenu'
import { NavBar } from '~/components/Navbar'

export const HomeLayout = () => {
  return (
    <>
      <NavBar />
      <div
        style={{
          padding: '3.5rem',
        }}
      >
        <Outlet />
      </div>
      <BottomMenu />
    </>
  )
}
