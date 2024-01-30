import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Classes from './index.module.css'

export const ChannelList: React.FC = () => {
  const navigate = useNavigate()
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
      name: '通知',
      icon: '',
      path: '/notice',
    },
    {
      name: '我的',
      icon: '',
      path: '/people/' + localStorage.getItem('username'),
    },
  ]

  const [active, setActive] = useState(0)

  const handleClick = (index: number) => {
    setActive(index)
    navigate(ChannelList[index].path)
  }

  return (
    <div className={Classes['channel-list']}>
      {ChannelList.map((item, index) => (
        <div
          key={item.name}
          className={`${Classes['channel-list-item']} ${
            active === index ? 'text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => handleClick(index)}
        >
          <div className="cursor-pointer">{item.name}</div>
        </div>
      ))}
    </div>
  )
}
