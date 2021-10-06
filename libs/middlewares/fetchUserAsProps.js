import { fetch } from '../fetch'

export default async function fetchUserAsProps(context, props) {
  const id = context.query.id
  return fetch('/users/' + id)
    .then(user => ({ props: { ...props, user } }))
    .catch(e => {
      throw e // そのままエラーにする
    })
}