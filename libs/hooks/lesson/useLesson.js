import { useState, useCallback, useEffect } from 'react'
import useFetch from '../useFetch'
import { useErrorDialogContext } from '../../contexts/errorDialogContext'

export default function useLesson(lessonID) {
  const [lesson, setLesson] = useState()
  const { fetchWithAuth } = useFetch()
  const { showError } = useErrorDialogContext()

  const fetchLesson = useCallback(() => {
    fetchWithAuth(`/lessons/${lessonID}?for_authoring=true`)
      .then(lesson => setLesson(lesson))
      .catch(e => {
        showError({
          message: '授業の取得に失敗しました。',
          original: e,
          canDismiss: false,
          callback: () => {
            fetchLesson()
          },
        })
      })
  }, [lessonID, fetchWithAuth, showError])

  useEffect(() => {
    fetchLesson()
  }, [fetchLesson])

  return lesson
}