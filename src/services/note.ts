import { BASE_URL } from './index'

export interface Pic {
  url: string
  width: number
  height: number
}

export async function addNote(
  title: string,
  content: string,
  tags: string[],
  pic_list: Pic[],
) {
  return fetch(`${BASE_URL}/note/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ title, content, tags, pic_list }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function getNotes({
  pageCurrent,
  pageSize,
}: {
  pageCurrent: number
  pageSize: number
}) {
  return fetch(`${BASE_URL}/note/query/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ pageCurrent, pageSize }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res.noteList
    })
}

export async function getNote(id: string) {
  return fetch(`${BASE_URL}/note/${id}`, {
    method: 'GET',
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

export async function likeNote(id: string) {
  return fetch(`${BASE_URL}/note/${id}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
      if (res.error) throw res.error
      return res
    })
}

export async function cancelLikeNote(id: string) {
  return fetch(`${BASE_URL}/note/${id}/like`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
      if (res.error) throw res.error
      return res
    })
}
