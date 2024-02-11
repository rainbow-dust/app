import { BASE_URL } from './index'

export interface Pic {
  url: string
  width: number
  height: number
}

export interface Note {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    username: string
    avatar_url: string
  }
  tags: {
    _id: string
    name: string
  }[]
  pic_list: Pic[]
  cover: Pic
  like_count: number
  is_liked: boolean
  created_at: string
}

export async function addNote(
  title: string,
  content: string,
  tags: string[],
  pic_list: Pic[],
) {
  return fetch(`${BASE_URL}/note/add`, {
    method: 'POST',

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
  tags,
  username,
}: {
  pageCurrent: number
  pageSize: number
  tags?: string[]
  username?: string
}) {
  return fetch(`${BASE_URL}/note/query/list`, {
    method: 'POST',

    body: JSON.stringify({ pageCurrent, pageSize, tags, username }),
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
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function cancelLikeNote(id: string) {
  return fetch(`${BASE_URL}/note/${id}/like`, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

// 获取点赞列表

export async function getUserLikes(
  username: string,
  noteQuery: { pageCurrent: number; pageSize: number },
) {
  return fetch(`${BASE_URL}/note/${username}/likes`, {
    method: 'POST',
    body: JSON.stringify(noteQuery),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res.data
    })
}
