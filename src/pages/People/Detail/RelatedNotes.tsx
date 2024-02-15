import useSWRInfinite from 'swr/infinite'

import { Feed } from '~/components/Feed'
import { IconError } from '~/components/Icons'
import { Tabs, useTabs } from '~/components/Tabs'
import { CollectList } from '~/pages/Collect/components'
import { Note, getNotes, getUserLikes } from '~/services'

const PAGE_SIZE = 10

export const RelatedNotes = ({ username }: { username: string }) => {
  const { activeTab, setActiveTab } = useTabs('creations')
  const { data, size, setSize, isValidating, isLoading, error } =
    useSWRInfinite<Note[]>(
      (index: number) => [
        'key-username/note/query/list' + activeTab + username,
        index,
      ], // 缓存什么的和 key相关
      ([, index]: [string, number]) => {
        return activeTab === 'creations'
          ? getNotes({
              pageCurrent: (index as number) + 1,
              pageSize: PAGE_SIZE,
              username,
            })
          : activeTab === 'likes'
          ? getUserLikes(username, {
              pageCurrent: (index as number) + 1,
              pageSize: PAGE_SIZE,
            })
          : []
      },
    )

  const notes: Note[] = data ? data.flat() : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  if (error) return <IconError />

  return (
    <>
      <Tabs
        tabs={[
          {
            id: 'creations',
            label: '作品',
            content: <div>作品</div>,
          },
          {
            id: 'likes',
            label: '喜欢',
            content: <div>喜欢</div>,
          },
          {
            id: 'collections',
            label: '收藏',
            content: <div>收藏</div>,
          },
        ]}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === activeTab) return
          else {
            setSize(1)
            setActiveTab(tab)
          }
        }}
      />

      {activeTab === 'collections' ? (
        <CollectList noteId={undefined} />
      ) : (
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
      )}
    </>
  )
}
