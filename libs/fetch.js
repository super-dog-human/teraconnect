import { default as isoFetch } from 'isomorphic-unfetch'
import { getSession } from 'next-auth/client'

export async function fetch(resource, option) {
  const url = process.env.NEXT_PUBLIC_TERACONNECT_API_URL + resource
  const response = await isoFetch(url, option)

  if (response.ok) {
    return await response.json()
  }

  const error = new Error(response.statusText)
  error.response = response

  throw error
}

export async function fetchToken() {
  getSession() // これによりtokenのexpireが更新される

  const url = process.env.NEXT_PUBLIC_TERACONNECT_FRONT_URL + '/api/auth/token'
  const response = await isoFetch(url, { credentials: 'include' })

  if (response.ok) {
    const body = await response.json()
    return body.token
  }

  const error = new Error(response.statusText)
  error.response = response

  throw error
}

export async function fetchWithAuth(resource, token) {
  if (!token) token = await fetchToken()
  return fetch(resource, { headers: headerWithToken(token) })
}

export async function post(resource, body, method='POST', header) {
  const token = await fetchToken()
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