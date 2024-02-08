import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { Feed } from '~/components/Feed'
import { Note, getNotes, queryTagDetail } from '~/services'

import Classes from './index.module.css'

const PAGE_SIZE = 10
export const Tag = () => {
  // 怎么讲呢..我不希望这里是首页的一部分，大概还是要改一改才行....

  // 从路由上获取 tagName
  const { tagName } = useParams()
  const { data: tagDetail } = useSWR('key-tag-detail/query', () =>
    queryTagDetail(tagName as string),
  )
  // 查询 tag, 并使用其找出相关 note
  const { data, size, setSize, isValidating, isLoading } = useSWRInfinite<
    Note[]
  >(
    (index: number) => ['key-tag/note/query/list', index],
    ([, index]: [string, number]) =>
      getNotes({
        pageCurrent: (index as number) + 1,
        pageSize: PAGE_SIZE,
        tags: [tagName as string],
      }),
  )

  const notes: Note[] = data ? data.flat() : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-color)',
        padding: '20px 0 100px 0',
        overflowY: 'scroll',
        zIndex: 100,
      }}
    >
      <div className={Classes['tag-info']}>{JSON.stringify(tagDetail)}</div>
      <Feed
        notes={notes}
        options={{
          isEmpty,
          isReachingEnd,
          isRefreshing,
          isLoadingMore,
          setSize,
          size,
        }}
      />
    </div>
  )
}
