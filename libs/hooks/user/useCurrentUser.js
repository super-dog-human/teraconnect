import { useState, useCallback, useEffect } from 'react'
import useFetch from '../useFetch'
import { useErrorDialogContext } from '../../contexts/errorDialogContext'

export default function useCurrentUser( ) {
  const [user, setUser] = useState()
  const { fetchWithAuth } = useFetch()
  const { showError } = useErrorDialogContext()

  const fetchCurrentUser = useCallback(() => {
    fetchWithAuth('/users/me').then(user => {
      setUser(user)
    }).catch(e => {
      if (e.response?.status === 401) {
        setUser({}) // 取得前と区別するため空objectをセットする
        return
      }
      console.error(e)
      showError({
        message: 'ログインユーザーの取得に失敗しました。',
        original: e,
        canDismiss: false,
        callback: () => {
          fetchCurrentUser()
        },
      })
    })
  }, [fetchWithAuth, showError])

  useEffect(() => {
    if (user) return
    fetchCurrentUser()
  }, [user, fetchCurrentUser])

  return user
}