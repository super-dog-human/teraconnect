import { useRef, useEffect } from 'react'
import { fetch as isoFetch, fetchToken as isoFetchToken, fetchWithAuth as isoFetchWithAuth, post as isoPost, putFile as isoPutFile } from '../fetch'
import { fetchVoiceFileURL as isoFetchVoiceFileURL, createVoice as isoCreateVoice, createGraphics as isoCreateGraphics } from '../fetchResource'

const timeoutMillisec = 1000 * 60

class TimeoutError extends Error {
  constructor(params) {
    super(params)
    this.name = 'TimeoutError'
  }
}

export default function useFetch() {
  const abortsRef = useRef({})

  function fetch(resource, option) {
    return requestWithAbortAndTimeout(signal => isoFetch(resource, { ...option, signal }))
  }

  function fetchToken() {
    return requestWithAbortAndTimeout(signal => isoFetchToken({ signal }))
  }

  function fetchWithAuth(resource, token) {
    return requestWithAbortAndTimeout(signal => isoFetchWithAuth(resource, token, { signal }))
  }

  function post(resource, body, method='POST', header) {
    return requestWithAbortAndTimeout(signal => isoPost(resource, body, method, header, { signal }))
  }

  function putFile(url, body, contentType) {
    return requestWithAbortAndTimeout(signal => (isoPutFile(url, body, contentType, { signal })))
  }

  function fetchVoiceFileURL(voiceID, lessonID) {
    return requestWithAbortAndTimeout(signal => isoFetchVoiceFileURL(voiceID, lessonID, { signal }))
  }

  function createVoice(elapsedTime, durationSec, lessonID) {
    return requestWithAbortAndTimeout(signal => isoCreateVoice(elapsedTime, durationSec, lessonID, { signal }))
  }

  function createGraphics(lessonID, files) {
    return requestWithAbortAndTimeout(signal => isoCreateGraphics(lessonID, files, { signal }))
  }

  function requestWithAbortAndTimeout(request) {
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
  }

  useEffect(() => {
    return () => {
      Object.values(abortsRef.current).forEach(c => c.abort())
    }
  }, [])

  return { fetch, fetchToken, fetchWithAuth, post, putFile, fetchVoiceFileURL, createVoice, createGraphics }
}