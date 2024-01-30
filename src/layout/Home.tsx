import { Outlet } from 'react-router-dom'

import { ChannelList } from '~/components/ChannelList'
import { NavBar } from '~/components/Navbar'

import Classes from './Home.module.css'

export const HomeLayout = () => {
  return (
    <>
      <div className={Classes['home-layout']}>
        <div className={Classes['home-layout-navbar']}>
          <NavBar />
        </div>
        <div className={Classes['home-layout-content']}>
          <Outlet />
        </div>
        <div className={Classes['home-layout-channel']}>
          <ChannelList />
        </div>
      </div>
    </>
  )
}
