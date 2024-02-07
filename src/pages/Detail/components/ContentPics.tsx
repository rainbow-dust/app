import React, { FC } from 'react'

import type { Pic } from '~/services'

import Classes from './ContentPics.module.css'

export const ContentPics: FC<{ pic_list?: Pic[] }> = ({ pic_list }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isMoving, setIsMoving] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const [offset, setOffset] = React.useState(0)

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsMoving(true)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMoving) {
      setOffset(e.touches[0].clientX - startX)
    }
  }

  const handleTouchEnd = () => {
    if (!isMoving || !pic_list?.length) return
    setIsMoving(false)
    if (offset > 50) {
      setCurrentIndex((currentIndex - 1 + pic_list.length) % pic_list.length)
    } else if (offset < -50) {
      setCurrentIndex((currentIndex + 1) % pic_list?.length)
    }
    setOffset(0)
  }
  return (
    <div className={Classes.container}>
      <div
        className={Classes.pics}
        style={{
          transition: isMoving ? 'none' : 'transform 0.3s',
          transform: `translateX(calc(-100% * ${currentIndex} + ${offset}px))`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pic_list?.map((pic) => (
          <div key={pic.url} className={Classes.pic} style={{}}>
            <img src={`http://192.168.2.153:9527${pic.url}`} alt={pic.url} />
          </div>
        ))}
      </div>
      <div className={Classes.dots}>
        {pic_list?.map((_, index) => (
          <div
            key={index}
            className={Classes.dot}
            style={{
              backgroundColor: currentIndex === index ? 'white' : 'gray',
            }}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  )
}
