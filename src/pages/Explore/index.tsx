import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { Feed } from '~/components/Feed'
import { getNotes } from '~/services'

// 哪些应该放在这里？

// 请求数据的逻辑
// 不对...tmd.. 跳转和连续/持久化数据流，是不是俩相矛盾的东西啊...
const PAGE_SIZE = 10

export const Explore = () => {
  const [queryStr, setQueryStr] = useState('')
  const queryTags = () => queryStr.split(' ').filter((i) => i)

  const swrOp = {
    key: (index: number) => ['key-/note/query/list', index],
    fetcher: ([, index]: [string, number]) =>
      getNotes({
        pageCurrent: (index as number) + 1,
        pageSize: PAGE_SIZE,
        tags: queryTags(),
      }),
  }
  return (
    <div>
      <Link to="/explore/123">123Modal</Link>
      <input
        value={queryStr}
        onChange={(e) => {
          setQueryStr(e.target.value)
        }}
      />

      <Feed swrOp={swrOp} />
      <Outlet />
    </div>
  )
}
