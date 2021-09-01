import { useState, useRef, useCallback, useEffect } from 'react'

const youtubeURL = 'https://www.youtube.com/embed/{contentID}?controls=0&autoplay=1&mute=1&start={startSec}'
const geogebraURL = 'https://www.geogebra.org/material/iframe/id/{contentID}/width/1600/height/715/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/false/ld/false/sri/false/ctl/false/sfsb/false/szb/false'

export default function useEmbeddingPlayer({ durationSec, embeddings }) {
  const [embedding, setEmbedding] = useState()
  const elapsedTimeRef = useRef(0)
  const initializedRef = useRef(false)

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
          const startSec = Math.round(newElapsedTime - newEmbedding.elapsedTime)
          const url = createURL(newEmbedding, startSec)
          return { contentID: newEmbedding.contentID, serviceName: newEmbedding.serviceName, url }
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
      setEmbedding()
    }
  }, [durationSec, embeddings])

  function seekEmbedding(e) {
    elapsedTimeRef.current = parseFloat(e.target.value)
    setEmbedding()
    updateEmbedding(0)
  }

  function createURL(embedding, startSec) {
    switch (embedding.serviceName) {
    case 'youtube':
      return youtubeURL.replace('{contentID}', embedding.contentID).replace('{startSec}', startSec)
    case 'geogebra':
      return geogebraURL.replace('{contentID}', embedding.contentID)
    default:
      throw new Error()
    }
  }

  const preloadEmbeddings = useCallback(() => {
    const urls = []
    Object.values(embeddings).forEach(emb => {
      if (emb.action !== 'show') return
      const url = createURL(emb)
      if (urls.includes(url)) return
      urls.push(url)

      const prefetchLink = document.createElement('link')
      prefetchLink.href = url
      prefetchLink.rel = 'prefetch'
      document.head.appendChild(prefetchLink)
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