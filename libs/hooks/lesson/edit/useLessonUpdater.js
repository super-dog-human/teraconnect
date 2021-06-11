import { useState, useRef, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import { useDialogContext } from '../../../contexts/dialogContext'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useFetch from '../../../hooks/useFetch'

const skipConfirmNextTimeKey = 'skipConfirmLessonUpdating'

export default function useLessonUpdater({ isLoading }) {
  const { post } = useFetch()
  const { showDialog } = useDialogContext()
  const { showError } = useErrorDialogContext()
  const [hasResourceDiff, setHasResourceDiff] = useState(false)
  const uploadableResourceRef = useRef({})
  const [isUpdating, setIsUpdating] = useState(false)
  const { lesson, material, avatars, embeddings, graphics, drawings, musics, speeches } = useLessonEditorContext()

  function storeUploadableResource(resource) {
    if (isLoading) return

    uploadableResourceRef.current = { ...uploadableResourceRef.current, ...resource }
    setHasResourceDiff(true)
  }

  function initialUploadSpeech() {
    if (material.created !== material.updated) return
    if (speeches.length === 0) return

    post(`/lessons/${lesson.id}/materials/${material.id}`, { speeches }, 'PATCH').catch(e => {
      showError({
        message: '初回更新に失敗しました。再度実行します。',
        original: e,
        canDismiss: false,
        callback: initialUploadSpeech,
      })
    })
  }

  async function updateLesson() {
    if (!hasResourceDiff) return

    if (localStorage.getItem(skipConfirmNextTimeKey) === 'true') {
      uploadToRemote()
    } else {
      showDialog({
        title: '授業の保存',
        message: '現在の状態を上書き保存しますか？',
        canDismiss: true,
        dismissName: 'キャンセル',
        callbackName: '実行',
        callback: uploadToRemote,
        skipConfirmNextTimeKey,
      })
    }
  }

  function uploadToRemote() {
    setIsUpdating(true)

    post(`/lessons/${lesson.id}/materials/${material.id}`, uploadableResourceRef.current, 'PATCH').then(() => {
      uploadableResourceRef.current = {}
      setIsUpdating(false)
      setHasResourceDiff(false)
    }).catch(e => {
      setIsUpdating(false)
      showError({
        message: '更新に失敗しました',
        original: e,
        canDismiss: true,
        callback: uploadToRemote,
      })
    })
  }

  useEffect(() => {
    if (isLoading) return
    initialUploadSpeech()
  }, [isLoading])

  useEffect(() => {
    storeUploadableResource({ avatars })
  }, [avatars])

  useEffect(() => {
    storeUploadableResource({ embeddings })
  }, [embeddings])

  useEffect(() => {
    storeUploadableResource({ graphics })
  }, [graphics])

  useEffect(() => {
    storeUploadableResource({ drawings })
  }, [drawings])

  useEffect(() => {
    storeUploadableResource({ musics })
  }, [musics])

  useEffect(() => {
    storeUploadableResource({ speeches })
  }, [speeches])

  return { hasResourceDiff, isUpdating, updateLesson }
}