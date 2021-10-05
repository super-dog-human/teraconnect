import { default as isoFetch } from 'isomorphic-unfetch'

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'
const OPEN_BD_API_URL = 'https://api.openbd.jp/v1/get?isbn='

// 本のタイトルは収録数が多いGoogle Books APIから取得する
export async function fetchBookTitle(isbn) {
  const response = await isoFetch(GOOGLE_BOOKS_API_URL + isbn)

  if (response.ok) {
    const body = await response.json()
    if (body.totalItems === 0) return ''
    return body.items[0].volumeInfo
  }

  const error = new Error(response.statusText)
  error.response = response

  throw error
}

// サムネイル・著者情報はレスポンスが早いopenBDから取得する
export async function fetchBookFast(isbn) {
  const response = await isoFetch(OPEN_BD_API_URL + isbn)

  if (response.ok) {
    const body = await response.json()
    if (!body[0]) return {}
    if (!body[0].onix.CollateralDetail.SupportingResource) return {}
    const url =  body[0].onix.CollateralDetail.SupportingResource[0].ResourceVersion[0].ResourceLink
    const author = body[0].summary.author
    return { url, author }
  }

  const error = new Error(response.statusText)
  error.response = response

  throw error
}