import { useState, useRef, useCallback, useEffect } from 'react'

const geogebraURL = 'https://www.geogebra.org/material/iframe/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/false/ld/false/sri/false/ctl/false/sfsb/false/szb/false/id/'

export default function useGeoGebraPlayer({ elapsedTimeRef, embeddings }) {
  const [geoGebra, setGeoGebra] = useState()
  const initializedRef = useRef(false)

  const updateGeoGebra = useCallback(() => {
    const newEmbedding = embeddings.filter(e => e.serviceName === 'geogebra').reverse().find(e => e.elapsedTime <= elapsedTimeRef.current)

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
  }, [elapsedTimeRef, embeddings])

  function createURL(embedding) {
    return geogebraURL + embedding.contentID
  }

  function seekEmbedding() {
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

  return { geoGebra, seekEmbedding, updateGeoGebra }
}