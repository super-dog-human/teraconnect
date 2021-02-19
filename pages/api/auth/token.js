import { getSession } from 'next-auth/client'
import jwt from 'next-auth/jwt'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    res.writeHead(401, { 'Content-Type': 'text/json' })
    res.end('session expired.')
    return
  }

  const secret = process.env.SECRET
  const token = await jwt.getToken({ req, secret, raw: true })
  res.status(200).json({ token })
}