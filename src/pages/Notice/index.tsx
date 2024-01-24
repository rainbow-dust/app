import useSWR from 'swr'

import { getNoticeList } from '~/services'

export const Notice = () => {
  const { data, error, isLoading } = useSWR(`/api/notice/list`, getNoticeList)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  return (
    <div>
      <h1>Notice</h1>
      <div className="notice-list">
        {data?.map((item) => (
          <div key={item._id} className="notice-item">
            {JSON.stringify(item)}
          </div>
        ))}
      </div>
    </div>
  )
}
