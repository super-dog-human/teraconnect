import { useState } from 'react'
import { useRouter } from 'next/router'
import { useErrorDialogContext } from '../../../libs/contexts/errorDialogContext'
import { post } from '../../../libs/fetch'

export default function useCreatingLesson(token) {
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { occurError } = useErrorDialogContext()

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
      .catch(e => {
        if (e.responseCode === '401') {
          router.push('/login')
          return
        }

        occurError({
          side: 'client',
          message: '授業の作成に失敗しました。再度実行しても失敗する場合は、運営者にご連絡ください。',
          original: e,
        })
        console.error(e)
        setIsCreating(false)
      })
  }

  return { onSubmit, isCreating }
}