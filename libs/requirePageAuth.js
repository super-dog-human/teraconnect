import { getSession } from 'next-auth/client'
import jwt from 'next-auth/jwt'
import { fetchWithAuth } from './fetch'

export default async function requirePageAuth(context) {
  const req = context.req
  const session = await getSession({ req })

  if (!session) {
    context.res.writeHead(307, { Location: '/api/auth/signin' })
    context.res.end()
    return { props: {} }
  }

  const secret = process.env.SECRET
  const token = await jwt.getToken({ req, secret, raw: true })

  if (req.url === '/users/new') {
    return { props: { token } }
  }

  return fetchWithAuth('/users/me', token)
    .then(user => ({ props: { user, token } }))
    .catch(e => {
      if (e.response?.status === 404) {
        context.res.writeHead(307, { Location: '/users/new' })
        context.res.end()
        return { props: {} }
      } else {
        throw e
      }
    })
}