import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDialogContext } from '../../../contexts/dialogContext'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useFetch  from '../../useFetch'
import { useForm } from 'react-hook-form'

export default function useCreatingLesson({ isIntroduction, userID }) {
  const selectedMethodRef = useRef('')
  const [isSelectedMethod, setIsSelectedMethod] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { showDialog } = useDialogContext()
  const { showError } = useErrorDialogContext()
  const { post } = useFetch()
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const needsRecordingProps = register('needsRecording')
  const { onChange: handleSubjectIDSelectChange, ...subjectIDSelectProps } = register('subjectID', { required: !isIntroduction })
  const { onChange: handleCategoryIDSelectChange, ...categoryIDSelectProps } = register('japaneseCategoryID', { required: !isIntroduction })
  const { onChange: handleTitleInputChange, ...titleInputProps } = register('title', { required: !isIntroduction })

  function handleModeButtonClick(e) {
    setIsSelectedMethod(true)
    selectedMethodRef.current = e.currentTarget.dataset.type
    const needsRecording = selectedMethodRef.current === 'record'

    if (isIntroduction) {
      createLesson({ isIntroduction, needsRecording })
    } else {
      setValue('needsRecording', needsRecording)
    }
  }

  function handleBackButtonClick() {
    setIsSelectedMethod(false)
    selectedMethodRef.current = null
  }

  function onSubmit(form) {
    createLesson(form)
  }

  function createLesson(body) {
    setIsCreating(true)

    if (typeof body.japaneseCategoryID === 'string') {
      body.japaneseCategoryID = parseInt(body.japaneseCategoryID)
    }

    if (typeof body.subjectID === 'string') {
      body.subjectID = parseInt(body.subjectID)
    }

    post('/lessons', body)
      .then(response => {
        if (body.needsRecording) {
          router.push(`/lessons/${response.id}/record`)
        } else {
          router.push(`/lessons/${response.id}/edit`)
        }
      })
      .catch(e => {
        setIsCreating(false)

        if (e.response?.status === 401) {
          router.push('/login')
        } else if (e.response?.status === 409 && isIntroduction) {
          showDialog({
            title: '自己紹介',
            message: '自己紹介は作成済みです。マイページへ移動します。',
            canDismiss: false,
            callbackName: '移動',
            callback: () => { router.push(`/users/${userID}`) },
          })
        } else {
          showError({
            message: '授業の作成に失敗しました。再度実行しても失敗する場合は、運営者にご連絡ください。',
            original: e,
            canDismiss: true,
            callback: () => { createLesson(body) },
          })
          console.error(e.response)
        }
      })
  }

  return { isCreating, isSelectedMethod, needsRecordingProps, subjectIDSelectProps, categoryIDSelectProps, titleInputProps,
    handleModeButtonClick, handleBackButtonClick, handleSubjectIDSelectChange, handleCategoryIDSelectChange, handleTitleInputChange, formErrors: errors, setValue, handleSubmit, onSubmit
  }
}