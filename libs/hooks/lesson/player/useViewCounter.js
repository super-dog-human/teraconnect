import { useRef, useCallback } from 'react'
import useFetch from '../../useFetch'

export default function useViewCounter({ lesson }) {
  const hasPlayedRef = useRef(false)
  const { post } = useFetch()

  const incrementViewCount = useCallback(() => {
    post(`/lesson_view_count?lesson_id=${lesson.id}`, null, 'PATCH').catch(e => {
      console.error(e) // エラー時はログを出力するのみ
    })
  }, [lesson, post])

  const startViewing = useCallback(() => {
    if (!lesson) return
    if (hasPlayedRef.current) return
    hasPlayedRef.current = true
    incrementViewCount()
  }, [lesson, incrementViewCount])

  return startViewing
}