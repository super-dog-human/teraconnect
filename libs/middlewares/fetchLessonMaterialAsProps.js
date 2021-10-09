import { fetchWithAuth } from '../fetch'

export default async function fetchLessonMaterialAsProps({ context, materialID, isShort, props }) {
  const id = context.query.id
  const cookie = context.req?.headers.cookie
  return fetchWithAuth(`/lessons/${id}/materials/${materialID}?is_short=${isShort}`, cookie)
    .then(material => ({ props: { ...props, material } }))
    .catch(e => {
      if (e.response?.status === '401') {
        context.res.writeHead(307, { Location: '/login' })
        context.res.end()
      } else {
        throw e
      }
    })
}