import { BASE_URL } from './index'

export async function getUnReadNoticeCount() {
  return fetch(`${BASE_URL}/notice/count`, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function getNoticeList(type?: string) {
  return fetch(`${BASE_URL}/notice/query/list`, {
    method: 'POST',

    body: JSON.stringify({ type }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res.data
    })
}
