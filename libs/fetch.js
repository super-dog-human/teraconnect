import fetch from 'isomorphic-unfetch'

export default async function Fetch(...args) {
  args[0] = process.env.TERACONNECT_API_URL + args[0]
  const res = await fetch(...args)
  return await res.json()
}