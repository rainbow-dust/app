import { FC, useEffect, useState } from 'react'

import { useScroll } from '~/hooks/useScroll'

interface WaterfallItem {
  id: string
  content: string
}

interface WaterfallProps {
  items: WaterfallItem[]
}

const Waterfall: FC<WaterfallProps> = ({ items }) => {
  const [cells, setCells] = useState<WaterfallItem[][]>([])
  const [visibleCells, setVisibleCells] = useState<WaterfallItem[][]>([])
  const { scroll } = useScroll(null)

  useEffect(() => {
    // 大概是，item 算完布局，然后根据算完的布局，去看哪些 item 是可见的，然后把可见的 item 放到 visibleCells 里面
    const cellWidth = 200
    const cellMargin = 10
    const cellHeight = 100
    const columnCount = Math.floor(window.innerWidth / (cellWidth + cellMargin))

    const columnHeights = new Array(columnCount).fill(0)

    items.forEach((item) => {
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights),
      )
      const cell = { ...item, height: cellHeight }
      cells[shortestColumnIndex]
        ? cells[shortestColumnIndex].push(cell)
        : (cells[shortestColumnIndex] = [cell])
      columnHeights[shortestColumnIndex] += cellHeight + cellMargin
    })

    setCells(cells)

    const visibleCells = cells.filter((_, index) => {
      const cellTop = columnHeights[index] - cellHeight
      const cellBottom = columnHeights[index] + cellHeight
      const scrollBottom = scroll + window.innerHeight
      return cellBottom > scroll && cellTop < scrollBottom
    })

    setVisibleCells(visibleCells)
  }, [items, cells, scroll])

  return (
    <div className="waterfall-container">
      {visibleCells.map((item, index) => (
        <WaterfallCell key={index} {...item} />
      ))}
    </div>
  )
}

const WaterfallCell: FC<WaterfallItem> = ({ id, content }) => {
  return (
    <div className="waterfall-item">
      {id}
      {content}
    </div>
  )
}

export default Waterfall
