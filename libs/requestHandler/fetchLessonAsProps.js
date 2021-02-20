import { fetchWithAuth } from '../fetch'

export default async function fetchLessonAsProps(context, props) {
  const id = context.query.id
  return fetchWithAuth(`/lessons/${id}?for_authoring=true`, props.token)
    .then(lesson => ({ props: { ...props, lesson }}))
    .catch(e => {
    if (e.response?.status === '401') {
      context.res.writeHead(307, { Location: '/login' })
      context.res.end()
    } else {
      throw e
    }
  })
}