import { BASE_URL } from './index'

export async function addComment(param: {
  note_id: string
  content: string
  root_comment_id?: string
  mentionee_id?: string
}) {
  return fetch(`${BASE_URL}/comment/add`, {
    method: 'POST',

    body: JSON.stringify({ ...param }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function getRootComments(note_id: string) {
  return fetch(`${BASE_URL}/comment/note/${note_id}/root_comment`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res.data
    })
}

export async function getChildComments(root_comment_id: string) {
  return fetch(
    `${BASE_URL}/comment/root_comment/${root_comment_id}/child_comment`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function likeComment(comment_id: string) {
  return fetch(`${BASE_URL}/comment/${comment_id}/like`, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function cancelLikeComment(comment_id: string) {
  return fetch(`${BASE_URL}/comment/${comment_id}/like`, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}
