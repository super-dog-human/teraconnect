import { useRef, useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import useFetch from '../../useFetch'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
const TEN_MIN = 1000 * 60 * 10
const SIGNED_URL_EXPIRES = 1000 * 60 * 60 * 24 * 3 - TEN_MIN // 3日 - 10分

export default function useResourceReloader() {
  const router = useRouter()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const timerRef = useRef()
  const [shouldReload, setShouldReload] = useState(false)
  const [ session ] = useSession()
  const { setGraphicURLs } = useLessonEditorContext()
  const { fetchWithAuth } = useFetch()

  async function setNextTimer() {
    // fetchTokenでセッションのexpireが1日延長されてしまうが許容する
    timerRef.current = setTimeout(() => {
      setShouldReload(true)
    }, SIGNED_URL_EXPIRES)
  }

  async function reloadGraphicURLs() {
    const graphicURLs = (await fetchGraphicURLs()).reduce((acc, r) => {
      acc[r.id] = { url: r.url, isUploading: false }
      return acc
    }, {})

    setGraphicURLs(graphicURLs)

    async function fetchGraphicURLs() {
      return fetchWithAuth(`/graphics?lesson_id=${lessonIDRef.current}`)
        .catch(e => {
          if (e.response?.status === 404) return []
          throw e
        })
    }
  }

  useEffect(() => {
    if (!timerRef.current) setNextTimer()

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!shouldReload) return

    if (!session || Date.parse(session.expires) < Date.now()) {
      return // セッションが切れていたら何もせず終了
    }

    reloadGraphicURLs()
    setNextTimer()
    setShouldReload(false)
  }, [shouldReload])
}