import { getSession } from 'next-auth/client'
import { fetchWithAuth } from '../fetch'

export default async function requirePageAuth(context) {
  const req = context.req
  const session = await getSession({ req })

  if (!session) {
    context.res.writeHead(307, { Location: '/api/auth/signin' })
    context.res.end()
    return { props: {} }
  }

  if (req.url === '/users/edit') {
    return { props: { user: session.user } }
  }

  return fetchWithAuth('/users/me', req?.headers.cookie)
    .then(user => ({ props: { user } }))
    .catch(e => {
      if (e.response?.status === 404) {
        context.res.writeHead(307, { Location: '/users/edit' })
        context.res.end()
        return { props: {} }
      } else {
        throw e
      }
    })
}