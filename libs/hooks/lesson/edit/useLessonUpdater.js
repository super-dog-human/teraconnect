import { useState, useRef, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import { useDialogContext } from '../../../contexts/dialogContext'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useFetch from '../../../hooks/useFetch'
import { useRouter } from 'next/router'

const skipConfirmNextTimeKey = 'skipConfirmLessonUpdating'

export default function useLessonUpdater({ isLoading, isExistsDiff, clearDiffFlag, clearCache }) {
  const { post } = useFetch()
  const { showDialog } = useDialogContext()
  const { showError } = useErrorDialogContext()
  const [hasResourceDiff, setHasResourceDiff] = useState(false)
  const uploadableResourceRef = useRef({})
  const [isUpdating, setIsUpdating] = useState(false)
  const { lesson, avatars, embeddings, graphics, drawings, musics, speeches } = useLessonEditorContext()
  const router = useRouter()

  function storeUploadableResource(resource) {
    if (isLoading) return

    uploadableResourceRef.current = { ...uploadableResourceRef.current, ...resource }
    setHasResourceDiff(true)
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

  function discardLessonDraft() {
    showDialog({
      title: '変更の破棄',
      message: '現在の変更を破棄して、最後に保存した状態に戻しますか？',
      canDismiss: true,
      dismissName: 'キャンセル',
      callbackName: '実行',
      callback: discardLessonAndReload,
    })
  }

  function uploadToRemote() {
    setIsUpdating(true)

    post(`/lessons/${lesson.id}/materials/${lesson.materialID}`, uploadableResourceRef.current, 'PATCH').then(() => {
      uploadableResourceRef.current = {}
      clearDiffFlag()
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

  function discardLessonAndReload() {
    clearCache()
    router.reload()
  }

  useEffect(() => {
    if (isLoading) return

    if (isExistsDiff()) { // キャッシュフラグが立っているなら未アップロードの差分がある
      setHasResourceDiff(true)
    }
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

  return { hasResourceDiff, isUpdating, updateLesson, discardLessonDraft }
}