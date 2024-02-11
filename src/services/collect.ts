import { BASE_URL, Note } from './index'

export interface Collect {
  _id: string
  name: string
  desc: string
  notes?: Note[]
  creator?: {
    username: string
  }
  is_collected?: boolean
}

export function getCollects(param: {
  username: string
  noteId?: string // 有这个参数就返回收藏夹内是否有这个文章
}) {
  return fetch(`${BASE_URL}/collect/query/list`, {
    method: 'POST',
    body: JSON.stringify(param),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res.data
    })
}

export function createCollect(collect: { name: string; desc: string }) {
  return fetch(`${BASE_URL}/collect/create`, {
    method: 'POST',
    body: JSON.stringify(collect),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export function getCollectDetail(param: { collectId: string }) {
  return fetch(`${BASE_URL}/collect/query/detail`, {
    method: 'POST',
    body: JSON.stringify(param),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export function addNoteToCollect(param: { noteId: string; collectId: string }) {
  return fetch(`${BASE_URL}/collect/${param.collectId}/add`, {
    method: 'POST',
    body: JSON.stringify(param),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export function removeNoteFromCollect(param: {
  noteId: string
  collectId: string
}) {
  return fetch(`${BASE_URL}/collect/${param.collectId}/remove`, {
    method: 'POST',
    body: JSON.stringify(param),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}
