// 这个页面会和 Tag 很像.
// 只不过会有一些特殊的调出方式，比如弹窗...或者 tag 也可以是弹窗？...
// 跟路由下的弹窗?

import { useParams } from 'react-router-dom'
import useSWR from 'swr'

import { Feed } from '~/components/Feed'
import { IconEmpty, IconError, IconLoading } from '~/components/Icons'
import { Note, getCollectDetail } from '~/services'

// 可以确认，单个 collect 的页面就是一个和tag一样的页面，但列表查询，是以弹窗的形式出现的。

export const Collect = () => {
  const { id } = useParams()
  const {
    data: collect,
    error,
    isLoading,
  } = useSWR(`/api/collect/query/detail/${id}`, () => {
    return getCollectDetail({ collectId: id as string })
  })
  if (error) return <IconError />
  if (isLoading) return <IconLoading />
  if (!collect) return <IconEmpty />
  return (
    <div>
      <h1>{collect.name}</h1>
      <p>{collect.desc}</p>
      <Feed
        notes={collect.notes as Note[]}
        options={{
          isEmpty: collect.notes.length === 0,
          isReachingEnd: true,
          isRefreshing: false,
          isLoadingMore: false,
          setSize: () => void 0,
          size: 0,
        }}
      />
    </div>
  )
}
