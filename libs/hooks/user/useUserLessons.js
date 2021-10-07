import { useState, useCallback, useEffect } from 'react'
import useFetch from '../useFetch'
import { useErrorDialogContext } from '../../contexts/errorDialogContext'

export default function useUserLessons(userID) {
  const [isLoading, setIsLoading] = useState(true)
  const [lessons, setLessons] = useState([])
  const { fetch } = useFetch()
  const { showError } = useErrorDialogContext()

  const fetchLessons = useCallback(() => {
    setIsLoading(true)

    fetch(`/users/${userID}/lessons`).then(lessons => {
      setIsLoading(false)
      setLessons(lessons)
    }).catch(e => {
      setIsLoading(false)
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
  }, [userID, fetch, showError])

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

  return { isLoading, lessons }
}