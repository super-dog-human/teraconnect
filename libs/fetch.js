import { default as isoFetch } from 'isomorphic-unfetch'

export async function fetch(resource, option, callback) {
  const url = process.env.NEXT_PUBLIC_TERACONNECT_API_URL + resource
  const response = await isoFetch(url, option)
  if (response.ok) {
    if (callback) callback(response)
    return await response.json()
  }

  const error = new Error(response.statusText)
  error.response = response

  throw error
}

export async function fetchWithAuth(resource, cookie, option={}, callback) {
  return fetch(
    resource,
    {
      headers: header(cookie), // サーバーからのリクエストではcookieを手動で付与する必要がある
      credentials: 'include',  // クライアントからのリクエストでは自動でcookieが付与される
      ...option
    },
    callback
  )
}

export async function post(resource, body, method='POST', option={}, csrfToken) {
  const headers = header()
  if (csrfToken) headers['X-CSRF-Token'] = csrfToken

  return fetch(resource, {
    method,
    headers,
    body: JSON.stringify(body),
    credentials: 'include',
    ...option,
  })
}

// Cloud Storageのファイルダウンロードのみに使用
export async function fetchFile(url) {
  const response = await isoFetch(url)

  if (response.ok) {
    return await response.blob()
  }

  const error = new Error(response.statusText)
  error.response = response

  throw error
}


// Cloud Storageへのファイルアップロードのみに使用
export async function putFile(url, body, contentType, option={}) {
  const response = await isoFetch(url, {
    method: 'PUT',
    header: { 'Content-Type': contentType },
    body: body,
    ...option,
  })

  if (response.ok) return response

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

function header(cookie) {
  if (cookie) {
    return { 'Content-Type': 'application/json', cookie }
  } else {
    return { 'Content-Type': 'application/json' }
  }
}