import { getSession } from 'next-auth/client'

export default async function requirePageAuth(context) {
  const req = context.req
  const session = await getSession({ req })

  if (!session) {
    context.res.writeHead(307, { Location: '/api/auth/signin' })
    context.res.end()
    return { props: {} }
  }

  return { props: { user: session } }
}