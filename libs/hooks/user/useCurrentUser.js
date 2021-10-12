import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import useFetch from '../useFetch'
import { useErrorDialogContext } from '../../contexts/errorDialogContext'

export default function useCurrentUser( ) {
  const router = useRouter()
  const [user, setUser] = useState()
  const { fetchWithAuth } = useFetch()
  const { showError } = useErrorDialogContext()

  const fetchCurrentUser = useCallback(() => {
    fetchWithAuth('/users/me').then(user => {
      setUser(user)
    }).catch(e => {
      if (e.response?.status === 401) {
        router.reload()
        return
      } else if (e.response?.status === 404) {
        router.push('/users/edit') // ユーザー登録画面へ遷移する
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
  }, [fetchWithAuth, router, showError])

  useEffect(() => {
    if (user) return
    fetchCurrentUser()
  }, [user, fetchCurrentUser])

  return user
}