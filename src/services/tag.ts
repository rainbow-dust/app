import { BASE_URL } from './index'

export async function addTag(name: string) {
  return fetch(`${BASE_URL}/tag/add`, {
    method: 'POST',

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
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}

// 查询某个 tag 的详细信息
export async function queryTagDetail(tagName: string) {
  return fetch(`${BASE_URL}/tag/query/${tagName}`, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw res.error
      return res
    })
}
