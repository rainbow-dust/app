import { BASE_URL } from './index'

export async function getUnReadNoticeCount() {
  return fetch(`${BASE_URL}/notice/count`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
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
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ type }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res.data
    })
}
