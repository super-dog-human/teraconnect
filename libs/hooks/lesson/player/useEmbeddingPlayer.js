import { useState, useRef, useCallback, useEffect } from 'react'

const youtubeURL = 'https://www.youtube.com/embed/{contentID}?controls=0&autoplay=1&mute=1&start={startAtSec}'
const geogebraURL = 'https://www.geogebra.org/material/iframe/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/false/ld/false/sri/false/ctl/false/sfsb/false/szb/false/id/'

export default function useEmbeddingPlayer({ isPlaying, durationSec, embeddings }) {
  const [embedding, setEmbedding] = useState()
  const [shouldSwitchPause, setShouldSwitchPause] = useState(false)
  const elapsedTimeRef = useRef(0)
  const initializedRef = useRef(false)
  const youtubeRef = useRef()

  function initializeEmbedding() {
    if (elapsedTimeRef.current >= durationSec) {
      elapsedTimeRef.current = 0
    }
  }

  const updateEmbedding = useCallback(incrementalTime => {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime
    const newEmbedding = embeddings.slice().reverse().find(e => e.elapsedTime <= newElapsedTime)

    setEmbedding(currentEmbedding => {
      // requestAnimationFrame経由で呼ばれた場合、最新のstateが取得できないのでsetState中でembeddingを取得する
      if (newEmbedding && newEmbedding.action === 'show') {
        if (!currentEmbedding || currentEmbedding.serviceName !== newEmbedding.serviceName || currentEmbedding.contentID !== newEmbedding.contentID || currentEmbedding.startAtSec !== newEmbedding.startAtSec) {
          const startAtSec = Math.round(newElapsedTime - newEmbedding.elapsedTime + newEmbedding.startAtSec)
          const url = createURL(newEmbedding, startAtSec)
          return { contentID: newEmbedding.contentID, serviceName: newEmbedding.serviceName, url, startAtSec: newEmbedding.startAtSec }
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

  function createURL(embedding, startAtSec=0) {
    switch (embedding.serviceName) {
    case 'youtube':
      return youtubeURL.replace('{contentID}', embedding.contentID).replace('{startAtSec}', startAtSec)
    case 'geogebra':
      return geogebraURL + embedding.contentID
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
      return
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

  useEffect(() => {
    if (!embedding) return
    if (embedding.serviceName !== 'youtube') return
    setShouldSwitchPause(true)
  }, [isPlaying, embedding])

  useEffect(() => {
    if (!shouldSwitchPause) return
    setShouldSwitchPause(false)
    const currentURL = youtubeRef.current.src
    let newURL
    if (isPlaying) {
      newURL = currentURL.replace('autoplay=0', 'autoplay=1')
    } else {
      const prefix = 'start='
      const currentStartAt = prefix + currentURL.substr(currentURL.indexOf(prefix) + prefix.length)
      const newStartAt = prefix + Math.round(elapsedTimeRef.current + embedding.startAtSec)
      newURL = currentURL.replace('autoplay=1', 'autoplay=0').replace(currentStartAt, newStartAt)
    }
    youtubeRef.current.src = newURL
  }, [shouldSwitchPause, isPlaying, embedding])

  return { embedding, youtubeRef, initializeEmbedding, updateEmbedding, seekEmbedding }
}