import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { NoticeContext } from '~/hooks/useNotice'

import Classes from './index.module.css'

export const ChannelList: React.FC = () => {
  const navigate = useNavigate()
  const { count } = useContext(NoticeContext)
  const ChannelList = [
    {
      name: '发现',
      icon: '',
      path: '/explore',
    },
    {
      name: '发布',
      icon: '',
      path: '/publish',
    },
    {
      name: '通知' + (count ? `(${count})` : ''),
      icon: '',
      path: '/notice',
    },
    {
      name: '我的',
      icon: '',
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
          <div className="cursor-pointer">{item.name}</div>
        </div>
      ))}
    </div>
  )
}
