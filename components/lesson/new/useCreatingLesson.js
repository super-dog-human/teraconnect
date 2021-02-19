import { useState } from 'react'
import { useRouter } from 'next/router'
import { useErrorDialogContext } from '../../../libs/contexts/errorDialogContext'
import { post } from '../../../libs/fetch'

export default function useCreatingLesson() {
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { showError } = useErrorDialogContext()

  function onSubmit(form) {
    setIsCreating(true)

    const body = {
      subjectID: parseInt(form.subjectID),
      japaneseCategoryID: parseInt(form.categoryID),
      title: form.title,
    }

    post('/lessons', body)
      .then(response => {
        if (form.createMethod === 'useVoice') {
          router.push(`/lessons/${response.id}/record`)
        } else {
          router.push(`/lessons/${response.id}/edit`)
        }
      })
      .catch(e => {
        if (e.response?.status === 401) {
          router.push('/login')
          return
        }

        showError({
          message: '授業の作成に失敗しました。再度実行しても失敗する場合は、運営者にご連絡ください。',
          original: e,
          canDismiss: true,
          callback: () => { onSubmit(form) },
        })
        console.error(e)

        setIsCreating(false)
      })
  }

  return { onSubmit, isCreating }
}