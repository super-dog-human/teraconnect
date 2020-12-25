import { useState } from 'react'
import { useRouter } from 'next/router'
import { post } from '../../../libs/fetch'

export default function useCreatingLesson(token) {
  const [error, setError] = useState()
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  async function onSubmit(form) {
    setCreating(true)

    const body = {
      subjectID: parseInt(form.subjectID),
      japaneseCategoryID: parseInt(form.categoryID),
      title: form.title,
    }

    await post('/lessons', body, token)
      .then(response => {
        if (body.createMethod === 'useVoice') {
          router.push(`/lessons/${response.id}/record`)
        } else {
          router.push(`/lessons/${response.id}/edit`)
        }
      })
      .catch(error => {
        setCreating(false)
        setError(error)
        throw error
      })
  }

  return { onSubmit, creating, creatingError: error }
}