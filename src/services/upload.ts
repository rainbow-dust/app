import { BASE_URL } from './index'

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
