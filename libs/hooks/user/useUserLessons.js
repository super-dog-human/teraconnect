import { useState, useCallback, useEffect } from 'react'
import useFetch from '../useFetch'
import { useErrorDialogContext } from '../../contexts/errorDialogContext'

export default function useUserLessons({ userID, currentUser }) {
  const [isLoading, setIsLoading] = useState(true)
  const [lessons, setLessons] = useState([])
  const { fetch, fetchWithAuth } = useFetch()
  const { showError } = useErrorDialogContext()

  const fetchUserLessons = useCallback(() => {
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
          fetchUserLessons()
        },
      })
    })
  }, [userID, fetch, showError])

  const fetchMyLessons = useCallback(() => {
    setIsLoading(true)

    fetchWithAuth('/users/me/lessons').then(lessons => {
      setIsLoading(false)
      setLessons(lessons)
    }).catch(e => {
      setIsLoading(false)
      if (e.response?.status === 404) return // なければ何もしない

      showError({
        message: 'ユーザー情報の取得に失敗しました。',
        original: e,
        canDismiss: false,
        callback: () => {
          fetchMyLessons()
        },
      })
    })
  }, [fetchWithAuth, showError])

  const fetchLessons = useCallback(() => {
    if (userID === currentUser.id) {
      fetchMyLessons()
    } else {
      fetchUserLessons()
    }
  }, [userID, currentUser, fetchMyLessons, fetchUserLessons])

  useEffect(() => {
    if (!currentUser) return
    fetchLessons()
  }, [currentUser, fetchLessons])

  return { isLoading, lessons }
}