import { useState, useCallback, useEffect } from 'react'
import useFetch from '../useFetch'
import { useErrorDialogContext } from '../../contexts/errorDialogContext'

export default function useLessonMaterial(lesson) {
  const [material, setLessonMaterial] = useState()
  const { fetchWithAuth } = useFetch()
  const { showError } = useErrorDialogContext()

  const fetchLessonMaterial = useCallback(() => {
    fetchWithAuth(`/lessons/${lesson.id}/materials/${lesson.materialID}`)
      .then(material => setLessonMaterial(material))
      .catch(e => {
        showError({
          message: '授業データの取得に失敗しました。',
          original: e,
          canDismiss: false,
          callback: () => {
            fetchLessonMaterial()
          },
        })
      })
  }, [lesson, fetchWithAuth, showError])

  useEffect(() => {
    if (!lesson) return
    fetchLessonMaterial()
  }, [lesson, fetchLessonMaterial])

  return material
}