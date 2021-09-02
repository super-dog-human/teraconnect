import { useState, useRef, useCallback, useEffect } from 'react'
import { fetchFile } from '../../../fetch'

const youtubeURL = 'https://www.youtube.com/embed/{contentID}?controls=0&autoplay=1&mute=1&start={startSec}'

export default function useEmbeddingPlayer({ durationSec, embeddings }) {
  const [embedding, setEmbedding] = useState()
  const elapsedTimeRef = useRef(0)
  const initializedRef = useRef(false)
  const geogebraFileCacheRef = useRef({})

  function initializeEmbedding() {
    if (elapsedTimeRef.current >= durationSec) {
      elapsedTimeRef.current = 0
    }
  }

  const updateEmbedding = useCallback(incrementalTime => {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime
    const newEmbedding = embeddings.slice().reverse().find(e => e.elapsedTime <= newElapsedTime)

    setEmbedding(currentEmbedding => {
      // requestAnimationFrame経由で呼ばれた場合、最新のstateが取得できないのでsetState中でgraphicを取得する
      if (newEmbedding && newEmbedding.action === 'show') {
        if (!currentEmbedding || currentEmbedding.serviceName !== newEmbedding.serviceName || currentEmbedding.contentID !== newEmbedding.contentID) {
          if (newEmbedding.serviceName === 'youtube') {
            const startSec = Math.round(newElapsedTime - newEmbedding.elapsedTime)
            const url = createYoutubeURL(newEmbedding, startSec)
            return { contentID: newEmbedding.contentID, serviceName: newEmbedding.serviceName, url }
          }
          if (newEmbedding.serviceName == 'geogebra') {
            const file = geogebraFileCacheRef.current[newEmbedding.contentID]
            if (file) {
              return { contentID: newEmbedding.contentID, serviceName: newEmbedding.serviceName, file }
            } else { // キャッシュが読めていなければ今回は再生できない
              return currentEmbedding
            }
          }
        } else {
          return currentEmbedding
        }
      } else {
        return
      }
    })

    if (newElapsedTime < durationSec) {
      elapsedTimeRef.current = newElapsedTime
    } else {
      elapsedTimeRef.current = durationSec
    }
  }, [durationSec, embeddings])

  function seekEmbedding(e) {
    elapsedTimeRef.current = parseFloat(e.target.value)
    setEmbedding()
    updateEmbedding(0)
  }

  function createYoutubeURL(embedding, startSec=0) {
    return youtubeURL.replace('{contentID}', embedding.contentID).replace('{startSec}', startSec)
  }

  const preloadEmbeddings = useCallback(() => {
    const urls = []
    Object.values(embeddings).forEach(emb => {
      if (emb.action !== 'show') return
      switch (emb.serviceName) {
      case 'youtube': {
        const url = createYoutubeURL(emb)
        if (urls.includes(url)) return
        urls.push(url)

        const prefetchLink = document.createElement('link')
        prefetchLink.href = url
        prefetchLink.rel = 'prefetch'
        document.head.appendChild(prefetchLink)
        return
      }
      case 'geogebra': {
        if (geogebraFileCacheRef.current[emb.contentID]) return
        fetchFile(emb.fileURL).then(body => {
          const reader = new FileReader()
          reader.readAsDataURL(body)
          reader.onload = (e => geogebraFileCacheRef.current[emb.contentID] = e.target.result.replace(/data:.*\/.*;base64,/, ''))
        })
        return
      }}
    })
  }, [embeddings])

  useEffect(() => {
    if (!embeddings || Object.keys(embeddings).length === 0) return
    if (initializedRef.current) return
    initializedRef.current = true
    preloadEmbeddings()
  }, [embeddings, preloadEmbeddings])

  useEffect(() => {
    if (!embeddings || Object.keys(embeddings).length === 0) return
    updateEmbedding(0)
  }, [embeddings, updateEmbedding])

  return { embedding, initializeEmbedding, updateEmbedding, seekEmbedding }
}