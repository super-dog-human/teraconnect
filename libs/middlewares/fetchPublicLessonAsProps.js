import { fetch } from '../fetch'

export default async function fetchPublicLessonAsProps(context, props) {
  const id = context.query.id
  const viewKey = context.query.view_key
  const result = viewKey ? fetch(`/lessons/${id}?view_key=${viewKey}`) : fetch(`/lessons/${id}`)
  return result
    .then(lesson => ({ props: { ...props, lesson } }))
    .catch(e => {
      return ({ props: { ...props, errorStatus: e.response.status } })
    })
}