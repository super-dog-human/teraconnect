import { default as isoFetch } from 'isomorphic-unfetch'

export async function fetch(resource, option) {
  const url = process.env.TERACONNECT_API_URL + resource
  const response = await isoFetch(url, option)

  if (response.ok) {
    return await response.json()
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

export function fetchWithAuth(resource, token) {
  return fetch(resource, { headers: headerWithToken(token) })
}

export function post(resource, body, token, method='POST', header) {
  return fetch(resource, {
    method,
    headers: header || headerWithToken(token),
    body: JSON.stringify(body)
  })
}

// Cloud Storageにファイルをアップロードする時のみに使用
export async function putFile(url, body, contentType) {
  const response = await isoFetch(url, {
    method: 'PUT',
    header: { 'Content-Type': contentType },
    body: body,
  })

  if (response.ok) return response

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

function headerWithToken(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}