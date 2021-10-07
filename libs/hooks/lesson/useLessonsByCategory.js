import { useState, useRef, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { useInView } from 'react-intersection-observer'
import useFetch from '../useFetch'
import { ONE_DAY_SECONDS } from '../../constants'

export default function useLessonsByCategory({ subjectID, categoryID }) {
  const fetchCursorRef = useRef('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [lessons, setLessons] = useState([])
  const [shouldFetchNext, setShouldFetchNext] = useState(false)
  const { ref: terminationRef, inView } = useInView()
  const { fetch } = useFetch()
  const fetcher = async (url) => await fetch(url)
  const { data: category } = useSWR(categoryID ? `/categories/${categoryID}?subject_id=${subjectID}` : '', fetcher, { dedupingInterval: ONE_DAY_SECONDS })

  const fetchLessons = useCallback(async () => {
    setIsLoading(true)

    fetch(`/lessons?category_id=${categoryID}&next_cursor=${fetchCursorRef.current}`).then(result => {
      setIsLoading(false)
      setHasMore(result.lessons.length === 18)

      fetchCursorRef.current = result.nextCursor
      setLessons(l => [...l, ...result.lessons])
    }).catch(e => {
      setIsLoading(false)
      setHasMore(false)

      if (e.response?.status === 404) return
      console.error(e)
    })
  }, [fetch, categoryID])

  useEffect(() => {
    if (!inView) return
    setShouldFetchNext(true)
  }, [inView])

  useEffect(() => {
    if (!shouldFetchNext) return
    setShouldFetchNext(false)
    fetchLessons()
  }, [shouldFetchNext, fetchLessons])

  useEffect(() => {
    if (!categoryID) return
    fetchLessons()
  }, [categoryID, fetchLessons])

  return { isLoading, hasMore, terminationRef, lessons, category }
}