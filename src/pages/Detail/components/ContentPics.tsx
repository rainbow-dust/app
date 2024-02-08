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

  // 处理一下轮播图内部小元素的宽高... 应该与 container 一样大...
  // 做不到。这里的 containerSize 是 0，我想也许是因为 containerRef 的大小是由内部元素撑开的，而内部元素又被设置成 containerSize 的大小... 造成了某种循环依赖...
  // 使用 background-image...然后固定 container 大小... 再之后只根据屏幕大小而不去考虑图片大小来设置 container 大小...
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = React.useState({
    width: 0,
    height: 0,
  })
  React.useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setContainerSize({ width, height })
    }
  }, [])

  return (
    <div className={Classes.container} ref={containerRef}>
      <div
        className={Classes.pics}
        style={{
          transition: isMoving ? 'none' : 'transform 0.3s',
          transform: `translateX(calc(-100% * ${
            (currentIndex - 1) / (pic_list?.length || 1)
          } + ${offset}px))`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pic_list?.map((pic) => (
          <div
            key={pic.url}
            className={Classes.pic}
            style={{
              width: containerSize.width,
              height: containerSize.height,
              backgroundImage: `url(http://192.168.2.153:9527${pic.url}`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            {/* <img src={`http://192.168.2.153:9527${pic.url}`} alt={pic.url}
            style={{
              objectFit: 'contain',
            }}
            /> */}
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
