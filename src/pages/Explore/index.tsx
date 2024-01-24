import React, { useState } from 'react'

// import useSWRInfinite from 'swr/infinite'

import { Feed } from '~/components/Feed'

export const Explore = () => {
  // swr 这里的 infinite 是直接修改 data... 也就是说... 没法用从组件里面触发回调的方式自己搞...我这么干主要是想把请求写到外部组件，但是 load more 这些东西又能塞到 feed 组件内部...
  // 嗯... 它怎么实现的？...似乎

  // const issues = data ? [].concat(...data) : []; ???? 也就是说 data 依旧只是单页数据，而这个工具只是多给了些辅助数据...
  // emmm... 那我用普通的 swr 再自己拼拼...吧...
  // const fetcher = () => Promise.resolve(loadMore())
  // const { data, mutate, size, setSize, isValidating, isLoading } =
  //   useSWRInfinite((index) => `${index}`, fetcher)

  const initNoteList = () => {
    const arr = new Array(100).fill(0).map((_, index) => {
      return {
        id: index,
        content: `content${index}`,
      }
    })
    return arr
  }

  const [page, setPage] = useState(10)
  const loadMore = async () => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
    const arr = new Array(10).fill(0).map((_, index) => {
      return {
        id: index + page * 10,
        content: `content${index + page * 10}`,
      }
    })
    setPage(page + 1)
    return arr
  }
  return (
    <div>
      <Feed initNoteList={initNoteList()} loadMore={loadMore} />
    </div>
  )
}
