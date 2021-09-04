import { useState, useRef, useCallback, useEffect } from 'react'

const geogebraURL = 'https://www.geogebra.org/material/iframe/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/false/ld/false/sri/false/ctl/false/sfsb/false/szb/false/id/'

export default function useGeoGebraPlayer({ durationSec, embeddings }) {
  const [geoGebra, setGeoGebra] = useState()
  const elapsedTimeRef = useRef(0)
  const initializedRef = useRef(false)

  function initializeGeoGebra() {
    if (elapsedTimeRef.current >= durationSec) {
      elapsedTimeRef.current = 0
    }
  }

  const updateGeoGebra = useCallback(incrementalTime => {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime
    const newEmbedding = embeddings.filter(e => e.serviceName === 'geogebra').reverse().find(e => e.elapsedTime <= newElapsedTime)

    setGeoGebra(currentEmbedding => {
      // requestAnimationFrame経由で呼ばれた場合、最新のstateが取得できないのでsetState中でembeddingを取得する
      if (newEmbedding && newEmbedding.action === 'show') {
        if (!currentEmbedding || currentEmbedding.serviceName !== newEmbedding.serviceName || currentEmbedding.contentID !== newEmbedding.contentID) {
          return { contentID: newEmbedding.contentID, serviceName: newEmbedding.serviceName, url: createURL(newEmbedding), startAtSec: newEmbedding.startAtSec }
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

  function createURL(embedding) {
    return geogebraURL + embedding.contentID
  }

  function seekEmbedding(e) {
    elapsedTimeRef.current = parseFloat(e.target.value)
    setGeoGebra()
    updateGeoGebra(0)
  }

  const preloadEmbeddings = useCallback(() => {
    const urls = []
    Object.values(embeddings.filter(e => e.serviceName === 'geogebra')).forEach(emb => {
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
    updateGeoGebra(0)
  }, [embeddings, updateGeoGebra])

  return { geoGebra, initializeGeoGebra, seekEmbedding, updateGeoGebra }
}