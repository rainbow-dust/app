import React, { useContext } from 'react'
import { BsBell, BsHouse, BsPen, BsPerson } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

import { NoticeContext } from '~/hooks/useNotice'

import Classes from './index.module.css'

export const ChannelList: React.FC = () => {
  const navigate = useNavigate()
  const { count } = useContext(NoticeContext)
  const ChannelList = [
    {
      name: '发现',
      icon: <BsHouse />,
      path: '/explore',
    },
    {
      name: '发布',
      icon: <BsPen />,
      path: '/publish',
    },
    {
      name: '通知' + (count ? `(${count})` : ''),
      icon: <BsBell />,
      path: '/notice',
    },
    {
      name: '我的',
      icon: <BsPerson />,
      path: '/people/' + localStorage.getItem('username'),
    },
  ]

  return (
    <div className={Classes['channel-list']}>
      {ChannelList.map((item) => (
        <div
          key={item.name}
          className={Classes['channel-list-item']}
          style={{
            color:
              window.location.pathname === item.path
                ? 'var(--theme-color)'
                : 'var(--text-color-secondary)',
          }}
          onClick={() => navigate(item.path)}
        >
          <>
            <span
              style={{
                verticalAlign: 'middle',
                marginRight: '10px',
              }}
            >
              {item.icon}
            </span>
            <span>{item.name}</span>
          </>
        </div>
      ))}
    </div>
  )
}
