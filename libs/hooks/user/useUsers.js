import { useState, useRef, useCallback, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useFetch from '../useFetch'

export default function useUsers() {
  const fetchCursorRef = useRef('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [users, setUsers] = useState([])
  const [shouldFetchNext, setShouldFetchNext] = useState(false)
  const { ref: terminationRef, inView } = useInView()
  const { fetch } = useFetch()

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)

    fetch(`/users?next_cursor=${fetchCursorRef.current}`).then(result => {
      setIsLoading(false)
      setHasMore(result.users.length === 20)

      fetchCursorRef.current = result.nextCursor
      setUsers(u => [...u, ...result.users])
    }).catch(e => {
      setIsLoading(false)
      setHasMore(false)

      if (e.response?.status === 404) return
      console.error(e)
    })
  }, [fetch])

  useEffect(() => {
    if (!inView) return
    setShouldFetchNext(true)
  }, [inView])

  useEffect(() => {
    if (!shouldFetchNext) return
    setShouldFetchNext(false)
    fetchUsers()
  }, [shouldFetchNext, fetchUsers])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { isLoading, hasMore, terminationRef, users }
}