import { getSession } from 'next-auth/client'

export default async function getSessionUserAsProps(context) {
  const req = context.req
  const session = await getSession({ req })

  if (!session) {
    return { props: {} }
  } else {
    return { props: { user: session.user } }
  }
}