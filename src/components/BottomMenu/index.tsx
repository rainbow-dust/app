import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const BottomMenu: React.FC = () => {
  const navigate = useNavigate()
  const ChannelList = [
    {
      name: '发现',
      icon: '',
      path: '/feed',
    },
    {
      name: '发布',
      icon: '',
      path: '/publish',
    },
    {
      name: '通知',
      icon: '',
      path: '/notification',
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
    <div className="flex justify-around items-center fixed bottom-0 left-0 right-0 h-12 bg-white">
      {ChannelList.map((item, index) => (
        <div
          key={item.name}
          className={`flex flex-col items-center justify-center ${
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
