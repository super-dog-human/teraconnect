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

export function post(resource, body, token) {
  return fetch(resource, {
    method: 'POST',
    headers: headerWithToken(token),
    body: JSON.stringify(body)
  })
}

function headerWithToken(token) {
  return  { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}