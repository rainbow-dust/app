const BASE_URL = '/api'
// 应该给一个统一的...把 auth token 和后续的 res.json() 什么的统一处理一下，顺便分一下哪些是需要 auth token 的前端就做一下拦截

// async function furinaFetch(url: string, options:furinaSetting) {
//   return fetch(url, options)
//     .then((res) => res.json())
//     .then((res) => {
//       if (res.error) throw res.error
//       return res
//     })
// }

export async function register(username: string, password: string) {
  return fetch(`${BASE_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
      if (res.error) throw res.error
      // 储存 bearer token...????为什么这边写的不执行？？？
      localStorage.setItem('token', res.token)
      return res
    })
}

export async function login(username: string, password: string) {
  return fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

// export async function getUserInfo(username: string) {
//   return fetch(`${BASE_URL}/user/${username}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       if (res.error) throw res.error
//       console.log(res)
//       return res
//     })
// }

export async function addNote(
  title: string,
  content: string,
  tags: string[],
  pic_urls: string[],
) {
  return fetch(`${BASE_URL}/note/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ title, content, tags, pic_urls }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function getNotes() {
  return fetch(`${BASE_URL}/note/query/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ pageCurrent: 1, pageSize: 100 }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
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

export async function addComment(
  note_id: string,
  content: string,
  root_comment_id?: string,
  mentionee_id?: string,
) {
  return fetch(`${BASE_URL}/comment/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ note_id, content, root_comment_id, mentionee_id }),
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

export async function cancelLikeComment(comment_id: string) {
  return fetch(`${BASE_URL}/comment/${comment_id}/like`, {
    method: 'DELETE',
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

export async function upload(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return fetch(`${BASE_URL}/upload/album`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function addTag(name: string) {
  return fetch(`${BASE_URL}/tag/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ name, description: '' }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

export async function queryTags(query_str: string) {
  return fetch(`${BASE_URL}/tag/query?query_str=${query_str}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res.data
    })
}
