import { useRef, useCallback, useEffect } from 'react'
import { fetch as isoFetch, fetchToken as isoFetchToken, fetchWithAuth as isoFetchWithAuth, post as isoPost } from '../fetch'
import { createVoice as isoCreateVoice, createGraphics as isoCreateGraphics, createMusic as isoCreateMusic } from '../postResource'

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

  const fetchToken = useCallback(() => {
    return requestWithAbortAndTimeout(signal => isoFetchToken({ signal }))
  }, [requestWithAbortAndTimeout])

  const fetchWithAuth = useCallback((resource, token) => {
    return requestWithAbortAndTimeout(signal => isoFetchWithAuth(resource, token, { signal }))
  }, [requestWithAbortAndTimeout])

  const post = useCallback((resource, body, method='POST', header) => {
    return requestWithAbortAndTimeout(signal => isoPost(resource, body, method, header, { signal }))
  }, [requestWithAbortAndTimeout])

  const createVoice = useCallback((elapsedTime, durationSec, lessonID) => {
    return requestWithAbortAndTimeout(signal => isoCreateVoice(elapsedTime, durationSec, lessonID, { signal }))
  }, [requestWithAbortAndTimeout])

  const createGraphics = useCallback((lessonID, files) => {
    return requestWithAbortAndTimeout(signal => isoCreateGraphics(lessonID, files, { signal }))
  }, [requestWithAbortAndTimeout])

  const createMusic = useCallback(fileName => {
    return requestWithAbortAndTimeout(signal => isoCreateMusic(fileName, { signal }))
  }, [requestWithAbortAndTimeout])

  useEffect(() => {
    return () => {
      Object.values(abortsRef.current).forEach(c => c.abort())
    }
  }, [])

  return { fetch, fetchToken, fetchWithAuth, post, createVoice, createGraphics, createMusic }
}