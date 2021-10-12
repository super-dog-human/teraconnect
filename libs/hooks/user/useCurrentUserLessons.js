import { useState, useCallback, useEffect } from 'react'
import useFetch from '../useFetch'
import { useErrorDialogContext } from '../../contexts/errorDialogContext'

export default function useCurrentUserLessons(user) {
  const [isLoading, setIsLoading] = useState(true)
  const [lessons, setLessons] = useState([])
  const { fetchWithAuth } = useFetch()
  const { showError } = useErrorDialogContext()

  const fetchLessons = useCallback(() => {
    setIsLoading(true)

    fetchWithAuth('/users/me/lessons').then(lessons => {
      setIsLoading(false)
      setLessons(lessons)
    }).catch(e => {
      setIsLoading(false)
      if (!user) return // ユーザー未登録なら何もしない
      if (e.response?.status === 404) return // なければ何もしない

      showError({
        message: '授業の取得に失敗しました。',
        original: e,
        canDismiss: false,
        callback: () => {
          fetchLessons()
        },
      })
    })
  }, [user, fetchWithAuth, showError])

  useEffect(() => {
    fetchLessons()
  }, [user, fetchLessons])

  return { isLoading, lessons }
}