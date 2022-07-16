import { useRef, useState, useEffect } from 'react'
import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function useSessionExpireChecker() {
  const [session] = useSession()
  const router = useRouter()
  const timerRef = useRef()
  const [shouldCheck, setShouldCheck] = useState(false)

  function setNextTimer(session) {
    const delay = Date.parse(session.expires) - Date.now() + 1000
    timerRef.current = setTimeout(() => {
      setShouldCheck(true)
    }, delay)
  }

  useEffect(() => {
    if (!timerRef.current) {
      getSession().then(session => setNextTimer(session))
    }

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!shouldCheck) return

    // セッションが予定通りexpireされていたらリロードする（非ログイン状態なのでログイン画面に遷移）
    if (!session || Date.parse(session.expires) < Date.now()) {
      router.reload()
      return
    }

    // セッションが更新されてexpireが延長されていたら、再度expire後にチェックする
    setNextTimer(session)
    setShouldCheck(false)
  }, [shouldCheck])
}