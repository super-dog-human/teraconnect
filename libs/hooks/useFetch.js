import { useRef, useCallback, useEffect } from 'react'
import { fetch as isoFetch, fetchWithAuth as isoFetchWithAuth, post as isoPost } from '../fetch'
const timeoutMillisec = 1000 * 60

class TimeoutError extends Error {
  constructor(params) {
    super(params)
    this.name = 'TimeoutError'
  }
}

export default function useFetch() {
  const abortsRef = useRef({})

  const requestWithAbortAndTimeout = useCallback(request => {
    const abortController = new AbortController()

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new TimeoutError('request timed out')) // タイムアウトでは専用のエラーにするため、rejectしてからabortする
        abortsRef.current[timeout].abort()
        delete abortsRef.current[timeout]
      }, timeoutMillisec)

      abortsRef.current[timeout] = abortController

      request(abortController.signal).then(r => {
        resolve(r)
      }).catch(e => {
        reject(e)
      }).finally(() => {
        clearTimeout(timeout)
        delete abortsRef.current[timeout]
      })
    })
  }, [])

  const fetch = useCallback((resource, option) => {
    return requestWithAbortAndTimeout(signal => isoFetch(resource, { ...option, signal }))
  }, [requestWithAbortAndTimeout])

  const fetchWithAuth = useCallback(resource => {
    const callback = response => {
      const csrfToken = response.headers.get('x-csrf-token')
      if (csrfToken) {
        document.getElementById('csrfToken').value = csrfToken
      }
    }
    return requestWithAbortAndTimeout(signal => isoFetchWithAuth(resource, null, { signal }, callback))
  }, [requestWithAbortAndTimeout])

  const post = useCallback((resource, body, method='POST') => {
    const tokenElement = document.getElementById('csrfToken')
    const csrfToken = tokenElement ? tokenElement.value : ''
    return requestWithAbortAndTimeout(signal => isoPost(resource, body, method, { signal }, csrfToken))
  }, [requestWithAbortAndTimeout])

  useEffect(() => {
    return () => {
      Object.values(abortsRef.current).forEach(c => c.abort())
    }
  }, [])

  return { fetch, fetchWithAuth, post }
}