import { useRouter } from 'next/router'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import { useDialogContext } from '../../../contexts/dialogContext'
import useFetch from '../../useFetch'

export default function useLessonDeleter({ lessonID }) {
  const { post } = useFetch()
  const { showDialog } = useDialogContext()
  const { showError } = useErrorDialogContext()
  const router = useRouter()

  const handleDeleteClick = () => {
    showDialog({
      title: '授業の削除',
      message: 'この授業を削除しますか？この操作は取り消せません。',
      canDismiss: true,
      dismissName: 'キャンセル',
      callbackName: '削除',
      callback: deleteLesson,
    })
  }

  const deleteLesson = () => {
    return post(`/lessons/${lessonID}`, null, 'DELETE')
      .then(() =>{
        router.push('/dashboard')
      }).catch(e => {
        showError({
          message: '授業の削除に失敗しました。',
          original: e,
          canDismiss: true,
          dismissName: '閉じる',
        })
      })
  }

  return { handleDeleteClick }
}