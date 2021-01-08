import { useState } from 'react'
import { useRouter } from 'next/router'
import { post } from '../../../libs/fetch'

export default function useCreatingLesson(token) {
  const [error, setError] = useState()
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  async function onSubmit(form) {
    setIsCreating(true)

    const body = {
      subjectID: parseInt(form.subjectID),
      japaneseCategoryID: parseInt(form.categoryID),
      title: form.title,
    }

    await post('/lessons', body, 'token')
      .then(response => {
        if (body.createMethod === 'useVoice') {
          router.push(`/lessons/${response.id}/record`)
        } else {
          router.push(`/lessons/${response.id}/edit`)
        }
      })
      .catch(error => {
        // TODO redirect login page when status 401

        setIsCreating(false)
        setError('授業の作成に失敗しました。')
        throw error
      })
  }

  return { onSubmit, isCreating, creatingError: error }
}