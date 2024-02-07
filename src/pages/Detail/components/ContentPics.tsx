import React, { FC } from 'react'

import type { Pic } from '~/services'

export const ContentPics: FC<{ pic_list?: Pic[] }> = ({ pic_list }) => {
  // 我想在这里整一个 slider，就是那种，左右滑动切换图片的那种
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#eee',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          transition: isMoving ? 'none' : 'transform 0.3s',
          transform: `translateX(calc(-100% * ${currentIndex} + ${offset}px))`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pic_list?.map((pic) => (
          <div
            key={pic.url}
            style={{
              width: '100%',
              height: '100%',
              flex: 'none',
            }}
          >
            <img
              src={`http://192.168.2.153:9527${pic.url}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        ))}
      </div>
      <div
        className="dots"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '10px',
        }}
      >
        {pic_list?.map((_, index) => (
          <div
            key={index}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: currentIndex === index ? 'white' : 'gray',
              margin: '0 5px',
              cursor: 'pointer',
            }}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  )
}
